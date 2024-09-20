<template>
    <div class="p-4">
        <Button variant="secondary" class="mx-2" disabled><FolderUp /></Button>
        <Button
            variant="secondary"
            class="mx-2"
            @click="
                () => {
                    dialogOpened = true;
                }
            "
        >
            <FileUp />
        </Button>
    </div>

    <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-80"
        v-if="dialogOpened"
        @keyup.esc="
            () => {
                dialogOpened = false;
            }
        "
    >
        <Card class="w-[350px]">
            <CardHeader>
                <CardTitle>{{ $t('create_file') }}</CardTitle>
                <CardDescription>{{ $t('specify_file_name') }}</CardDescription>
            </CardHeader>
            <CardContent>
                <div class="grid gap-4 py-4">
                    <div v-if="!fileSelected" class="grid w-full max-w-sm items-center gap-1.5">
                        <Label class="my-2" for="file-picture">File</Label>
                        <Input id="file-picture" type="file" @change="handleFileUpload" />
                    </div>
                    <div v-if="fileSelected" class="mt-4 grid grid-cols-4 items-center gap-4">
                        <Label for="file-name" class="my-2 text-right font-medium">
                            {{ $t('file_name') }}
                        </Label>
                        <Input
                            id="file-name"
                            class="col-span-3"
                            v-model="fileName"
                            @keyup.enter="uploadFileAndInfos"
                        />
                    </div>
                    <div v-if="fileSelected" class="grid grid-cols-4 items-center gap-4">
                        <Label for="file-extension" class="my-2 text-right font-medium">
                            {{ $t('extension') }}
                        </Label>
                        <Input
                            disabled
                            id="file-extension"
                            class="col-span-3"
                            v-model="fileExtension"
                        />
                    </div>
                </div>
            </CardContent>
            <CardFooter class="flex justify-between space-x-8 px-6 pb-6">
                <Button
                    variant="outline"
                    @click="
                        () => {
                            dialogOpened = false;
                        }
                    "
                >
                    Cancel
                </Button>
                <ButtonLoading
                    :loading="isLoading"
                    :text="t('create_file')"
                    :execute="uploadFileAndInfos"
                />
            </CardFooter>
        </Card>
    </div>
</template>

<script setup lang="ts">
    interface UploadsProps {
        selectedFolder: Number;
    }
    const props = defineProps<UploadsProps>();

    import { useI18n } from '#imports';
    const { t } = useI18n();
    import { useToast } from '@/components/ui/toast/use-toast';
    const { toast } = useToast();

    import { FileUp, FolderUp } from 'lucide-vue-next';
    import { AccessStatus } from '@prisma/client';
    import errorCodes from '~/utils/codes';

    const fileName = ref('');
    const fileExtension = ref('');
    const fileSelected = ref(false);
    const isLoading = ref(false);
    const dialogOpened = ref(false);
    const fileToUpload = ref<File | null>(null);
    const fileCreated = ref(false);
    const id = ref(-1);
    const name_in_s3 = ref('');

    function handleFileUpload(event: Event) {
        const element = event.target as HTMLInputElement;
        const file = element?.files[0];
        if (file) {
            if (file.size > 1000000000) {
                // 1.0GB - limited by array buffer, so by memory
                toast({
                    title: t('too_large'),
                    description: t('file_limit'),
                    variant: 'destructive',
                });
                return;
            }
            const fullName = file.name;
            const lastDot = fullName.lastIndexOf('.');
            fileName.value = fullName.substring(0, lastDot);
            fileExtension.value = fullName.substring(lastDot + 1);
            fileSelected.value = true;
            fileToUpload.value = file;
        }
    }

    async function uploadFileAndInfos() {
        if (!fileToUpload.value) {
            dialogOpened.value = false;
            return;
        }
        isLoading.value = true;
        try {
            const fileData = await readFile(fileToUpload.value);
            const ethAddress = getAddValue();
            const key = await deriveKeyFromEthAddress(ethAddress);
            const encryptedData: Uint8Array = await encryptFile(key, fileData);
            const base64String = uint8ArrayToBase64(encryptedData);
            const data = await $fetch('/api/file/upload', {
                method: 'POST',
                body: JSON.stringify({
                    name: fileName.value,
                    idParent: props.selectedFolder,
                    statut: AccessStatus.USER,
                    size: fileToUpload.value.size,
                    extension: fileExtension.value,
                    file: base64String,
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            id.value = data.id;
            name_in_s3.value = data.name_in_s3;
            await createNewFileInside(
                props.selectedFolder,
                fileName.value,
                fileExtension.value,
                fileToUpload.value.size,
            );
            fileCreated.value = true;
            isLoading.value = false;
        } catch (error) {
            console.error('Error uploading file:', error);
        } finally {
            isLoading.value = false;
            dialogOpened.value = false;
        }
    }

    const files = defineModel('files');

    async function createNewFileInside(id: Number, name: string, extension: string, size: number) {
        if (files.value.find((file) => file.idParent == id && file.name === name)) {
            toast({
                title: t('file_exists'),
                description: t('file_exists_desc'),
                variant: 'destructive',
            });
        }
        const newFile: File = {
            id: id.value,
            name: name,
            date: new Date().toISOString(),
            isFolder: false,
            extension: extension,
            idParent: id,
            size: 0,
            statut: 'you',
            name_in_s3: name_in_s3.value,
        };
        files.value.push(newFile);
        toast({
            title: t('success'),
            description: t('file_created'),
        });
    }
</script>
