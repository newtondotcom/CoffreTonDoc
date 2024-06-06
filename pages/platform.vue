<template>
    <LayoutTop />
    <LayoutFilters />
    <div class="w-full flex space-x-3 lg:overflow-hidden grow relative min-w-0">
      <ul class="min-w-full">
        <li v-for="(file, index) in files" :key="index" class="flex select-none items-center rounded-xl border-2 border-dashed border-transparent px-2.5 py-2 cursor-pointer hover:bg-light-background dark:hover:bg-dark-foreground">
            <div class="relative w-16 shrink-0"><IconsFolder /></div>
            <div class="flex flex-col pl-2 min-w-0">
                <div class="item-name mb-0.5 block overflow-hidden text-ellipsis whitespace-nowrap text-sm font-bold lg:pr-0 pr-4 hover:underline cursor-text">{{ file.name }}</div>
                <div class="min-w-0">
                <small class="block text-xs text-gray-500 dark:text-gray-500">
                    <span>{{ file.number }}</span>
                    <span>{{ file.date }}</span>
                    <span>{{ file.isFolder }}</span>
                    <span>{{ file.extension }}</span>
                </small>
                </div>
            </div>
        </li>
      </ul>
    </div>
  </template>
  
  <script setup lang="ts">
  
  interface File {
    name: string;
    number: number;
    date: string;
    isFolder: boolean;
    extension: string | null;
  }
  
  const files = ref<File[]>([]);
  
  // Fonction pour générer un nom de fichier aléatoire
  function generateFileName() {
    const adjectives = ['Red', 'Blue', 'Green', 'Yellow', 'Purple'];
    const nouns = ['Dog', 'Cat', 'Bird', 'Fish', 'Elephant'];
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    return `${adjective}_${noun}`;
  }
  
  // Fonction pour générer de faux fichiers
  function generateFakeFiles(count: number) {
    const fakeFiles: File[] = [];
    for (let i = 0; i < count; i++) {
      fakeFiles.push({
        name: generateFileName(),
        number: Math.floor(Math.random() * 100),
        date: new Date().toISOString(),
        isFolder: Math.random() < 0.5, // 50% de chance que ce soit un dossier
        extension: Math.random() < 0.8 ? 'jpg' : null // 80% de chance que ce soit une image
      });
    }
    return fakeFiles;
  }
  
  // Générer 10 faux fichiers
  files.value = generateFakeFiles(10);
  </script>
  