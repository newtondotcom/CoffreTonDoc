<template>
    <div class="w-[85%] flex flex-col">
      <LayoutTop />
      <div class="sticky top-0 bg-white z-10 flex flex-row justify-between p-2">
        <LayoutBreadcrumb :navigateToFolder="navigateToFolder" :navigateToRoot="navigateToRoot" :breadcrumb="breadcrumb" />
        <div class="flex flex-row">
            <ButtonNews :createNewFile :createNewFolder/>
        </div>
      </div>
      <div class="w-full flex space-x-3 lg:overflow-hidden grow relative min-w-0">
        <ButtonCommand v-if="isSearching" />
        <div class="text-center min-w-full">
          <ul class="justify-center align-middle items-center px-4">
            <li class="flex flex-row justify-between text-center mx-4 px-4">
                    <span>{{ $t('list_date') }}</span>
                    <span class="w-[60%]">{{ $t('list_name') }}</span>
                    <span>{{ $t('list_size') }}</span>
                    <span>{{ $t('list_access') }}</span>
            </li>
            <ScrollArea class="h-[70vh]">
            <li v-for="(file, index) in filteredFiles" :key="index" @click="handleItemClick(file)" class="mx-4 flex flex-col select-none align-middle items-center rounded-xl border-2 border-dashed border-transparent px-2.5 py-2 cursor-pointer">
              <Separator class="my-4" />
              <LayoutEntity :file :openItem :deleteItem :createNewFile :createNewFolder/>
            </li>
              <Separator class="my-4" />
            </ScrollArea>
          </ul>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { generateFakeFiles } from '~/lib/utils';
  import { ref, computed, watch } from 'vue';
  import type { File } from '~/types/types';
import { AccessStatus } from '@prisma/client';
  
  const files = ref<File[]>([]);
  const folderSelected = ref<number>(-1);
  const breadcrumb = ref<{ id: number, name: string }[]>([]);
  
  const isSearching = ref(false);
  const isRenameModalOpen = ref(false);
  const fileToRename = ref<File | null>(null);
  const newFileName = ref<string>('');
  
  const filteredFiles = computed(() => {
    return files.value.filter(file => file.idParent === folderSelected.value);
  });
  
  watch(folderSelected, (newFolder) => {
    updateBreadcrumb(newFolder);
  });
  
  function test() {
    console.log('test');
  }
  
  function navigateToRoot() {
    folderSelected.value = -1;
  }
  
  function navigateToFolder(folderId: number) {
    folderSelected.value = folderId;
  }
  
  function updateBreadcrumb(folderId: number) {
    const newBreadcrumb: { id: number, name: string }[] = [];
    let currentFolder = folderId;
  
    while (currentFolder !== -1) {
      const folder = files.value.find(file => file.id === currentFolder);
      if (folder) {
        newBreadcrumb.unshift({ id: folder.id, name: folder.name });
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
      folderSelected.value = file.id;
    } else {
      console.log('File selected:', file);
    }
  }
  
  function openItem(file: File) {
    if (file.isFolder) {
      folderSelected.value = file.id;
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
  
  function renameFile() {
    if (fileToRename.value) {
      fileToRename.value.name = newFileName.value;
      isRenameModalOpen.value = false;
      console.log("modal closed");
    } else {
      console.log("fileToRename");
    }
  }
  
  function deleteItem(file: File) {
    console.log('Deleting file:', file);
    files.value = files.value.filter(f => f.id !== file.id);
  }
  
  async function createNewFile(name : string, extension: string, idParent: number) {
    console.log('Creating new file in folder:');
    const newFile: File = {
      id: Date.now(),
      name: name,
      date: new Date().toISOString(),
      isFolder: false,
      extension: extension,
      idParent: idParent,
      size: 0,
      statut : "you"
    };
    files.value.push(newFile);
  }

  async function createNewFolder(name: string) {
    console.log('Creating new folder in folder:');
    const idParent = folderSelected.value;
    const newFolder: File = {
      id: Date.now(),
      name: name,
      date: new Date().toISOString(),
      isFolder: true,
      extension: '',
      idParent: idParent,
      size: 0,
      statut : "you"
    };
    files.value.push(newFolder);
    const statut = AccessStatus.USER;
    const body = {name, idParent, statut};
    const data = await $fetch('/api/folder/create', {
      method: 'POST',
      body: JSON.stringify(body)
    });
  }
  
  files.value = generateFakeFiles(10);
  
  updateBreadcrumb(folderSelected.value);
  </script>
  