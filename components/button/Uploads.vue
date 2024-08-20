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
                            @keyup.enter="encryptAndUpload"
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
            <CardFooter class="flex justify-between px-6 pb-6">
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
                <Button type="button" @click="encryptAndUpload">
                    {{ $t('create_file') }}
                    <div v-if="isLoading" class="ml-1 flex">
                        <svg
                            class="m-1 h-4 w-4 animate-spin"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                class="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                stroke-width="4"
                            ></circle>
                            <path
                                class="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            ></path>
                        </svg>
                    </div>
                </Button>
            </CardFooter>
        </Card>
    </div>
</template>

<script setup lang="ts">
    interface UploadsProps {
        createNewFileInside: Function;
        createNewFolderInside: Function;
        filteredFiles: Object;
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
    const uploadInfos = ref({
        id: 0,
        url: '',
        nameS3: '',
    });

    function handleFileUpload(event) {
        const file = event?.target?.files[0];
        if (file) {
            if (file.size > 1000000000) {
                // 1.0GB - limited by array buffer
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

    async function fetchUploadInfos() {
        try {
            // Query for the presigned URL
            const data = await $fetch('/api/file/upload', {
                method: 'POST',
                body: JSON.stringify({
                    name: fileName.value,
                    idParent: props.selectedFolder,
                    statut: AccessStatus.USER,
                    size: fileToUpload.value.size,
                    extension: fileExtension.value,
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            uploadInfos.value = data;
        } catch (error) {
            console.error('Error uploading file:', error);
        } finally {
        }
    }

    async function uploadFile(dataToUpload: Uint8Array) {
        if (uploadInfos.value.url === '') {
            await fetchUploadInfos();
        }
        try {
            const formData = new FormData();
            formData.append('file', dataToUpload);
            await fetch(uploadInfos.value.url, {
                method: 'PUT',
                body: formData,
            });

            fileCreated.value = true;
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    }

    async function encryptAndUpload() {
        isLoading.value = true;
        const result: string = await props.createNewFileInside(
            props.selectedFolder,
            fileName.value,
            fileExtension.value,
        );
        if (result.includes(errorCodes.file_already_exists)) {
            isLoading.value = false;
            return;
        }
        try {
            await fetchUploadInfos();
            const ethAddress = getAddValue();
            const data = await readFile(fileToUpload.value);
            const key = await deriveKeyFromEthAddress(ethAddress);
            const encryptedData: Uint8Array = await encryptFile(key, data);
            await uploadFile(encryptedData);
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred.');
        } finally {
            isLoading.value = false;
            dialogOpened.value = false;
        }
    }
</script>
