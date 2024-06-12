import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



// Fonction pour générer un nom de fichier aléatoire
export function generateFileName() {
  const adjectives = ['Red', 'Blue', 'Green', 'Yellow', 'Purple'];
  const nouns = ['Dog', 'Cat', 'Bird', 'Fish', 'Elephant'];
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${adjective}_${noun}`;
}

// Fonction pour générer de faux fichiers avec des sous-dossiers et des fichiers enfants
export function generateFakeFiles(count: number) {
  const fakeFiles: File[] = [];
  const rootFolders: number[] = [];
  
  for (let i = 0; i < count; i++) {
    const isFolder = Math.random() < 0.5;
    const newFile: File = {
      name: generateFileName(),
      id: i,
      date: new Date().toISOString(),
      isFolder,
      extension: !isFolder && Math.random() < 0.8 ? 'vue' : 'pdf',
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