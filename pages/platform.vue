<template>
    <div>
      <ul>
        <li v-for="(file, index) in files" :key="index">
          <span>{{ file.name }}</span>
          <span>{{ file.number }}</span>
          <span>{{ file.date }}</span>
          <span>{{ file.isFolder }}</span>
          <span>{{ file.extension }}</span>
        </li>
      </ul>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  
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
  