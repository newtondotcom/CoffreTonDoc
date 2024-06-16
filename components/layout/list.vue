<template>
<div class="w-[85%] flex flex-col">
    <LayoutTop />
    <div class="z-1 flex flex-row justify-between px-2 pl-8">
        <LayoutBreadcrumb :navigateToFolder="navigateToFolder" :navigateToRoot="navigateToRoot" :breadcrumb="breadcrumb" />
        <div class="flex flex-row">
            <ButtonNews :createNewFile :createNewFolder :filteredFiles />
            <ButtonUploads :createNewFile :createNewFolder :filteredFiles :selectedFolder />
        </div>
    </div>
    <div class="w-full flex space-x-3 lg:overflow-hidden grow relative min-w-0">
        <div class="text-center min-w-full">
            <ul class="justify-center align-middle items-center px-4">
                <li class="flex flex-row justify-between text-center mx-4 px-4 py-2">
                    <span>{{ $t('list_date') }}</span>
                    <span class="w-[60%]">{{ $t('list_name') }}</span>
                    <span>{{ $t('list_size') }}</span>
                    <span>{{ $t('list_access') }}</span>
                </li>
                <ScrollArea class="h-[70vh]">
                    <li v-for="(file, index) in filteredFiles" :key="index" @click="handleItemClick(file)" class="mx-4 flex flex-col select-none align-middle items-center rounded-xl cursor-pointer">
                        <LayoutEntity :file :openItem :deleteItem :createNewFile :createNewFolder :renameFile />
                        <Separator />
                    </li>
                    <Separator />
                </ScrollArea>
            </ul>
        </div>
    </div>
</div>
</template>

  
  
<script setup lang="ts">
import {
    generateFakeFiles
} from '~/lib/utils';
import {
    ref,
    computed,
    watch
} from 'vue';
import type {
    File
} from '~/types/types';
import {
    AccessStatus
} from '@prisma/client';
import {
    useToast
} from '@/components/ui/toast/use-toast'
import {
    ToastAction
} from '@/components/ui/toast'
const {
    toast
} = useToast();

const files = ref < File[] > ([]);
const selectedFolder = ref < number > (-1);
const breadcrumb = ref < {
    id: number,
    name: string
} [] > ([]);

const isRenameModalOpen = ref(false);
const fileToRename = ref < File | null > (null);
const newFileName = ref < string > ('');

const filteredFiles = computed(() => {
    return files.value.filter(file => file.idParent === selectedFolder.value);
});

watch(selectedFolder, (newFolder) => {
    updateBreadcrumb(newFolder);
});

async function getArborescence() {
    const body = {
        fileId: selectedFolder.value
    };
    const data = await $fetch('/api/both/arborescence', {
        method: 'POST',
        body: JSON.stringify(body)
    });
    files.value = data;
    console.log('Arborescence:', data);
}

function test() {
    console.log('test');
}

function navigateToRoot() {
    selectedFolder.value = -1;
}

function navigateToFolder(folderId: number) {
    selectedFolder.value = folderId;
}

function updateBreadcrumb(folderId: number) {
    const newBreadcrumb: {
        id: number,
        name: string
    } [] = [];
    let currentFolder = folderId;

    while (currentFolder !== -1) {
        const folder = files.value.find(file => file.id === currentFolder);
        if (folder) {
            newBreadcrumb.unshift({
                id: folder.id,
                name: folder.name
            });
            currentFolder = folder.idParent;
        } else {
            currentFolder = -1;
        }
    }

    breadcrumb.value = newBreadcrumb;
    console.log(newBreadcrumb);
}

function handleItemClick(file: File) {
    if (file.isFolder) {
        selectedFolder.value = file.id;
    } else {
        console.log('File selected:', file);
    }
}

function openItem(file: File) {
    if (file.isFolder) {
        selectedFolder.value = file.id;
    } else {
        console.log('Opening file:', file);
    }
}

function openRenameModal(file: File) {
    fileToRename.value = file;
    newFileName.value = file.name;
    isRenameModalOpen.value = true;
    console.log(file.name);
}

async function renameFile(fileId: string, newName: string) {
    const body = {
        fileId,
        newName
    };
    const data: string = await $fetch('/api/both/rename', {
        method: 'POST',
        body: JSON.stringify(body)
    });
    console.log('Renamed file:', data);
    if (data == "ok") {
        files.value = files.value.map(f => {
            if (f.id === fileId) {
                f.name = newName;
            }
            return f;
        });
        toast({
            title: 'Success',
            description: 'File renamed successfully',
        });
    } else {
        toast({
            title: 'Error',
            description: 'An error occured while renaming the file',
            variant: 'destructive'
        });
    }
}

async function deleteItem(fileId: string) {
    console.log('Deleting file:', fileId);
    const body = {
        fileId
    };
    const data = await $fetch('/api/both/delete', {
        method: 'POST',
        body: JSON.stringify(body)
    });
    console.log('Deleted file:', data);
    if (data == "ok") {
        files.value = files.value.filter(f => f.id !== fileId);
        toast({
            title: 'Success',
            description: 'File deleted successfully',
        });
    } else {
        toast({
            title: 'Error',
            description: 'An error occured while deleting the file',
            variant: 'destructive'
        });
    }
}

async function createNewFile(name: string, extension: string) {
    console.log('Creating new file in folder:');
    const idParent = selectedFolder.value;
    const size = 1000;
    const statut = AccessStatus.USER;
    const body = {
        name,
        extension,
        idParent,
        size,
        statut
    };
    const data = await $fetch('/api/file/create', {
        method: 'POST',
        body: JSON.stringify(body)
    });
    const newFile: File = {
        id: data,
        name: name,
        date: new Date().toISOString(),
        isFolder: false,
        extension: extension,
        idParent: idParent,
        size: 0,
        statut: "you"
    };
    files.value.push(newFile);
}

async function createNewFolder(name: string) {
    console.log('Creating new folder in folder:');
    const idParent = selectedFolder.value;
    const statut = AccessStatus.USER;
    const body = {
        name,
        idParent,
        statut
    };
    const data = await $fetch('/api/folder/create', {
        method: 'POST',
        body: JSON.stringify(body)
    });
    const newFolder: File = {
        id: data,
        name: name,
        date: new Date().toISOString(),
        isFolder: true,
        extension: '',
        idParent: idParent,
        size: 0,
        statut: "you"
    };
    files.value.push(newFolder);
}

onMounted(() => {
    getArborescence();
    updateBreadcrumb(selectedFolder.value);
});
</script>
