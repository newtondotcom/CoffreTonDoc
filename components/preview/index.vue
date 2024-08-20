<template>
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
        <Card class="h-[90vh] w-[92vw]">
            <CardHeader>
                <CardTitle>Message Edition</CardTitle>
                <CardDescription>Deploy your new project in one-click.</CardDescription>
            </CardHeader>
            <CardContent>
                <PreviewNop v-if="!fileSupported" />
                <div v-else>
                    <div v-if="loading">Loading</div>
                    <div v-else>
                        <!--
                <PreviewDocx v-if="extension == 'docx'" />
                -->
                        <PreviewPdf v-if="extension == 'pdf'" />
                        <PreviewPptx v-if="extension == 'pptx'" />
                        <!-- ko 
                <PreviewTxt v-if="extension == 'txt' || extension == 'vue'" />
                <!--
                <PreviewXlsx v-if="extension == 'xlsx'" />
                -->
                    </div>
                </div>
            </CardContent>
            <CardFooter class="flex justify-between px-6 pb-6">
                <Button variant="outline">Cancel</Button>
                <Button type="button" class="ml-1" size="sm">Send</Button>
            </CardFooter>
        </Card>
    </div>
</template>

<script setup lang="ts">
    interface PreviewProps {
        filename: string;
        extension: string;
        name_in_s3: string;
        keyToDecrypt: string;
    }
    const props = defineProps<PreviewProps>();

    const open = defineModel('open');

    const supportedExtensions = ['docx', 'pdf', 'pptx', 'txt', 'xlsx', 'ag', 'ts', 'js', 'vue'];
    const fileSupported = ref(false);

    const loading = ref(true);
    const fileUrl = ref('');

    // need to decrypt

    async function getUrlToPreview() {
        const url = await $fetch('/api/file/preview', {
            body: JSON.stringify({ name_s3: props.name_in_s3 }),
        });
        if (url) {
            // need to decrypt
            fileUrl.value = url;
        }
    }

    if (supportedExtensions.includes(props.extension)) {
        fileSupported.value = true;
    }

    onMounted(async () => {
        if (fileSupported.value) {
            await getUrlToPreview();
            loading.value = false;
        }
    });
</script>
