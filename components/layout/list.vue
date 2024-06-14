<template>
    <div class="w-[85%] flex flex-col">
      <LayoutTop />
      <div class="sticky top-0 bg-white z-10 flex flex-row justify-between p-2">
        <LayoutBreadcrumb :navigateToFolder="navigateToFolder" :navigateToRoot="navigateToRoot" :breadcrumb="breadcrumb" />
        <div class="flex flex-row">
          <Button variant="secondary" class="mx-2"><FolderPlus /></Button>
          <Button variant="secondary" class="mx-2"><FilePlus /></Button>
        </div>
      </div>
      <div class="w-full flex space-x-3 lg:overflow-hidden grow relative min-w-0">
        <ButtonCommand v-if="isSearching" />
        <div class="text-center min-w-full">
          <ul class="justify-center align-middle items-center">
            <li class="flex flex-row justify-between text-center">
                    <span>Date</span>
                    <span class="w-[60%]">Nom</span>
                    <span>Taille</span>
                    <span>Accès</span>
            </li>
            <li v-for="(file, index) in filteredFiles" :key="index" @click="handleItemClick(file)" class="flex select-none items-center rounded-xl border-2 border-dashed border-transparent px-2.5 py-2 cursor-pointer hover:bg-light-background dark:hover:bg-dark-foreground">
              <LayoutEntity :file="file" :openItem="openItem" :openRenameModal="openRenameModal" :deleteItem="deleteItem" :createNewItem="createNewItem"/>
            </li>
            <Separator class="my-4" />
          </ul>
        </div>
      </div>
    </div>
  
    <UModal v-model="isRenameModalOpen" prevent-close>
      <UCard :ui="{ ring: '', divide: 'divide-y divide-white dark:divide-gray-800'}">
        <template #header>
          Rename File
        </template>
        <UInput v-model="newFileName" type="text" placeholder="New file name" required class="px-6" />
        <template #footer>
          <div class="flex justify-end">
            <UButton type="button" @click="isRenameModalOpen = false" class="btn btn-secondary mr-2">Cancel</UButton>
            <UButton type="submit" @click="renameFile" class="btn btn-primary">Rename</UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </template>
  
  <script setup lang="ts">
  import { generateFakeFiles } from '~/lib/utils';
  import { FolderPlus, FilePlus } from 'lucide-vue-next';
  import { ref, computed, watch } from 'vue';
  import type { File } from '~/types/types';
  
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
  
  function createNewItem(file: File) {
    console.log('Creating new item in folder:', file);
    const newItem: File = {
      id: Date.now(),
      name: 'New Item',
      date: new Date().toISOString(),
      isFolder: false,
      extension: 'txt',
      idParent: file.id,
      size: 20000
    };
    files.value.push(newItem);
  }
  
  files.value = generateFakeFiles(10);
  
  updateBreadcrumb(folderSelected.value);
  </script>
  