<template>
    <Preview
        v-if="previewingFile"
        :file="previewedFile"
        :keyToDecrypt="key"
        :close="closePreview"
    />

    <div class="flex w-[85%] flex-col">
        <LayoutTop />
        <div class="z-1 flex flex-row justify-between px-2 pl-8">
            <LayoutBreadcrumb
                :navigateToFolder="navigateToFolder"
                :navigateToRoot="navigateToRoot"
                :breadcrumb="breadcrumb"
            />
            <div class="flex flex-row">
                <ButtonNews :createNewFileInside :createNewFolderInside :selectedFolder />
                <ButtonUploads :selectedFolder v-model:files="files" />
            </div>
        </div>
        <div
            class="relative mx-2 flex w-full min-w-0 grow space-x-3 rounded-xl border-2 border-dashed border-secondary lg:overflow-hidden"
        >
            <div class="min-w-full text-center">
                <ul class="items-center justify-center px-4 align-middle">
                    <li
                        class="mx-4 flex cursor-pointer flex-row justify-between px-4 py-2 text-center"
                    >
                        <span class="min-w-[15%]">{{ $t('list_date') }}</span>
                        <span class="min-w-[60%]">{{ $t('list_name') }}</span>
                        <span class="min-w-[15%]">{{ $t('list_size') }}</span>
                    </li>
                    <li
                        v-if="fileLoading"
                        v-for="i in 5"
                        class="mx-4 flex cursor-pointer flex-row justify-between px-4 py-2 text-center"
                    >
                        <Skeleton class="h-10 w-[100%]" />
                    </li>
                    <li v-if="!fileLoading && filteredFiles.length === 0">
                        <Separator />
                        <div class="mx-4 flex flex-row justify-between px-4 py-2 text-center">
                            <span>{{ $t('no_files') }}</span>
                        </div>
                    </li>
                    <ScrollArea v-else class="h-[75vh]">
                        <li
                            v-for="(file, index) in filteredFiles"
                            :key="index"
                            @click="handleItemClick(file)"
                            class="mx-4 flex cursor-pointer select-none flex-col items-center rounded-xl align-middle"
                        >
                            <LayoutEntity
                                :file
                                :openItem
                                :createNewFileInside
                                :createNewFolderInside
                                v-model:selectedFiles="selectedFiles"
                                v-model:files="files"
                            />
                            <Separator />
                        </li>
                    </ScrollArea>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import type { File } from '@prisma/client';
    import { AccessStatus } from '@prisma/client';
    import errorCodes from '~/utils/codes';

    import { useToast } from '@/components/ui/toast/use-toast';
    const { toast } = useToast();
    const previewingFile = ref(false);
    const previewedFile = ref(null);

    const files = ref<File[]>([]);
    const selectedFiles = ref<File[]>([]);
    const selectedFolder = ref<number>(-1);
    const breadcrumb = ref<
        {
            id: number;
            name: string;
        }[]
    >([]);
    const fileLoading = ref(true);

    const ethAddress = getAddValue();
    const key = await deriveKeyFromEthAddress(ethAddress);

    const filteredFiles = computed(() => {
        return files.value
            .filter((file) => file.idParent === selectedFolder.value)
            .sort((a, b) => new Date(b.date) - new Date(a.date));
    });

    watch(selectedFolder, (newFolder) => {
        updateBreadcrumb(newFolder);
        getArborescence();
    });

    async function getArborescence() {
        fileLoading.value = true;
        const body = {
            fileId: selectedFolder.value,
        };
        const data = await $fetch('/api/both/arborescence', {
            method: 'POST',
            body: JSON.stringify(body),
        });
        files.value = data.sort(
            (a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );
        fileLoading.value = false;
    }

    function navigateToRoot() {
        selectedFolder.value = -1;
    }

    function navigateToFolder(folderId: number) {
        selectedFolder.value = folderId;
    }

    function closePreview() {
        previewingFile.value = false;
    }

    function updateBreadcrumb(folderId: number) {
        const newBreadcrumb: {
            id: number;
            name: string;
        }[] = [];
        let currentFolder = folderId;

        while (currentFolder !== -1) {
            const folder = files.value.find((file) => file.id === currentFolder);
            if (folder) {
                newBreadcrumb.unshift({
                    id: folder.id,
                    name: folder.name,
                });
                currentFolder = folder.idParent;
            } else {
                currentFolder = -1;
            }
        }

        breadcrumb.value = newBreadcrumb;
    }

    function handleItemClick(file: File) {
        if (file.isFolder) {
            selectedFolder.value = file.id;
        }
    }

    function openItem(file: File) {
        if (file.isFolder) {
            selectedFolder.value = file.id;
        } else {
            previewedFile.value = file;
            previewingFile.value = true;
        }
    }

    async function createNewFileInside(id: string, name: string, extension: string) {
        const size = 0;
        const statut = AccessStatus.USER;
        const body = {
            name,
            extension,
            idParent: id,
            size,
            statut,
        };
        const data = await $fetch('/api/file/create', {
            method: 'POST',
            body: JSON.stringify(body),
        });
        if (data.message == errorCodes.file_already_exists) {
            toast({
                title: t('file_exists'),
                description: t('file_exists_desc'),
                variant: 'destructive',
            });
            return errorCodes.file_already_exists;
        }
        toast({
            title: t('success'),
            description: t('file_created'),
        });
        const newFile: File = {
            id: data,
            name: name,
            date: new Date().toISOString(),
            isFolder: false,
            extension: extension,
            idParent: id,
            size: 0,
            statut: 'you',
        };
        files.value.push(newFile);
        return errorCodes.success;
    }

    async function createNewFolderInside(idParent: string, name: string) {
        const statut = AccessStatus.USER;
        const body = {
            name,
            idParent: idParent,
            statut,
        };
        const data = await $fetch('/api/folder/create', {
            method: 'POST',
            body: JSON.stringify(body),
        });
        if (data.message == errorCodes.folder_already_exists) {
            toast({
                title: 'Error',
                description: 'A folder with the same name already exists in this folder',
                variant: 'destructive',
            });
            return;
        }
        toast({
            title: 'Success',
            description: 'Folder created successfully',
        });
        const newFolder: File = {
            id: data,
            name: name,
            date: new Date(),
            isFolder: true,
            extension: '',
            idParent: idParent,
            size: 0,
            statut: 'you',
        };
        files.value.push(newFolder);
    }

    onMounted(() => {
        getArborescence();
        updateBreadcrumb(selectedFolder.value);
    });
</script>
