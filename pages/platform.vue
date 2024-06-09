<template>
  <LayoutTop />
  <LayoutFilters />
  <div class="w-full flex space-x-3 lg:overflow-hidden grow relative min-w-0">
    <!-- BREADCRUMBS -->
    <div class="text-center">
    <div class="flex flex-row justify-between items-center">
      <UBreadcrumb :links="links" class="mb-6 ml-6 lg:px-[100px]" />   
      </div> 
    <ul class="min-w-full">
      <li v-for="(file, index) in filteredFiles" @click="folderSelected = file.isFolder ? file.id : folderSelected" :key="index" class="flex select-none items-center rounded-xl border-2 border-dashed border-transparent px-2.5 py-2 cursor-pointer hover:bg-light-background dark:hover:bg-dark-foreground">
        <div class="relative w-16 shrink-0">
          <IconsFolder v-if="file.isFolder"/>
          <IconsThumbnail :extension="file.extension" v-else />
        </div>
        <div class="flex flex-col pl-2 min-w-0">
          <div class="item-name mb-0.5 block overflow-hidden text-ellipsis whitespace-nowrap text-sm font-bold lg:pr-0 pr-4 hover:underline cursor-text">{{ file.name }}</div>
          <div class="min-w-0">
            <small class="block text-xs text-gray-500 dark:text-gray-500">
              <span>{{ file.id }} </span>
              <span>{{ file.date }} </span>
              <span>{{ file.isFolder }} </span>
              <span>{{ file.extension }} </span>
              <span>{{ file.idParent }}</span>
            </small>
          </div>
        </div>
      </li>
    </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { File } from '~/types/types';

const files = ref<File[]>([]);
const folderSelected = ref<number>(-1);

// Filtrer les fichiers en fonction de idParent
const filteredFiles = computed(() => {
  return files.value.filter(file => file.idParent === folderSelected.value);
});

// Fonction pour générer un nom de fichier aléatoire
function generateFileName() {
  const adjectives = ['Red', 'Blue', 'Green', 'Yellow', 'Purple'];
  const nouns = ['Dog', 'Cat', 'Bird', 'Fish', 'Elephant'];
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${adjective}_${noun}`;
}

// Fonction pour générer de faux fichiers avec des sous-dossiers et des fichiers enfants
function generateFakeFiles(count: number) {
  const fakeFiles: File[] = [];
  const rootFolders: number[] = [];
  
  for (let i = 0; i < count; i++) {
    const isFolder = Math.random() < 0.5;
    const newFile: File = {
      name: generateFileName(),
      id: i,
      date: new Date().toISOString(),
      isFolder,
      extension: !isFolder && Math.random() < 0.8 ? 'jpg' : 'pdf',
      idParent: -1 // Initialement pas de parent
    };

    fakeFiles.push(newFile);
    if (isFolder) {
      rootFolders.push(i);
    }
  }

  // Créer des fichiers enfants pour chaque dossier racine
  rootFolders.forEach(parentId => {
    const childCount = Math.floor(Math.random() * 5) + 1; // entre 1 et 5 fichiers enfants
    for (let i = 0; i < childCount; i++) {
      const childFile: File = {
        name: generateFileName(),
        id: fakeFiles.length,
        date: new Date().toISOString(),
        isFolder: false,
        extension: 'txt',
        idParent: parentId
      };
      fakeFiles.push(childFile);
    }
  });

  return fakeFiles;
}
const links = [{
  label: 'Home',
  icon: 'i-heroicons-home',
  to: '/'
}, {
  label: 'Repositories',
  icon: 'i-heroicons-square-3-stack-3d',
  to: '/repos'
}, {
  label: name,
  icon: 'i-heroicons-link'
}];

// Générer 10 faux fichiers
files.value = generateFakeFiles(10);
</script>
