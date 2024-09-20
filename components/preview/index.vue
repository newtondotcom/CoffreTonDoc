<template>
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
        <Card>
            <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>
                    Have a look at {{ props.file.name }}.{{ props.file.extension }}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <PreviewNop v-if="!fileSupported" />
                <div v-else>
                    <div v-if="loading">Loading</div>
                    <div v-else>
                        <!--
                <PreviewDocx v-if="props.file.extension == 'docx'" />
                -->
                        <PreviewPdf v-if="props.file.extension == 'pdf'" :blob="fileBlob" />
                        <PreviewPptx v-if="props.file.extension == 'pptx'" />
                        <!-- ko 
                <PreviewTxt v-if="props.file.extension == 'txt' || props.file.extension == 'vue'" />
                <!--
                <PreviewXlsx v-if="props.file.extension == 'xlsx'" />
                -->
                    </div>
                </div>
            </CardContent>
            <CardFooter class="flex justify-between px-6 pb-6">
                <Button variant="outline" @click="close">Cancel</Button>
            </CardFooter>
        </Card>
    </div>
</template>

<script setup lang="ts">
    interface PreviewProps {
        file: Object;
        keyToDecrypt: CryptoKey;
        close: () => void;
    }
    const props = defineProps<PreviewProps>();

    import { useToast } from '@/components/ui/toast/use-toast';
    const { toast } = useToast();

    const open = defineModel('open');

    const supportedExtensions = ['docx', 'pdf', 'pptx', 'txt', 'xlsx', 'ag', 'ts', 'js', 'vue'];
    const fileSupported = ref(false);

    const loading = ref(true);
    const fileUrl = ref('');
    const fileBlob = ref<Blob | null>(null);

    // need to decrypt

    async function getUrlToPreview() {
        // Download the file from the server
        const base64File = await $fetch('/api/file/download', {
            method: 'POST',
            body: {
                fileId: props.file.id,
            },
        }).catch((error) => {
            console.error(error);
            toast({
                title: 'Error',
                description: 'Error downloading file',
                variant: 'destructive',
            });
        });
        const fileData: Uint8Array = base64ToUint8Array(base64File);
        const decryptedData = await decryptFile(props.keyToDecrypt, fileData);

        // Download the file to the user's device
        fileBlob.value = new Blob([decryptedData], { type: props.file.extension });
    }

    if (supportedExtensions.includes(props.file.extension)) {
        fileSupported.value = true;
    }

    onMounted(async () => {
        if (fileSupported.value) {
            await getUrlToPreview();
            loading.value = false;
        } else {
            toast({
                title: 'Error',
                description: 'File type not supported',
                variant: 'destructive',
            });
            loading.value = false;
        }
    });
</script>
