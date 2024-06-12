<template>
  <LayoutTop />
  <div class="flex flex-row justify-between">
    <div class="flex flex-row justify-between items-center px-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink @click="navigateToRoot">
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator v-if="breadcrumb.length" />
          <BreadcrumbItem v-for="(crumb, index) in breadcrumb" :key="index">
            <BreadcrumbLink @click="navigateToFolder(crumb.id)">
              {{ crumb.name }}
            </BreadcrumbLink>
            <BreadcrumbSeparator v-if="index < breadcrumb.length - 1" />
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
    <LayoutFilters />
  </div>
  <div class="w-full flex space-x-3 lg:overflow-hidden grow relative min-w-0">
    <ButtonCommand v-if="isSearching" />
    <div class="text-center">
      <ul class="min-w-full">
        <li v-for="(file, index) in filteredFiles" :key="index" @click="handleItemClick(file)" class="flex select-none items-center rounded-xl border-2 border-dashed border-transparent px-2.5 py-2 cursor-pointer hover:bg-light-background dark:hover:bg-dark-foreground">
          <ContextMenu>
            <ContextMenuTrigger class="w-full">
              <div class="flex flex-row">
                <div class="relative w-16 shrink-0">
                  <IconsFolder v-if="file.isFolder" />
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
              </div>
            </ContextMenuTrigger>
            <ContextMenuContent class="w-64 bg-white">
              <ContextMenuItem @click="openItem(file)">
                Open
                <ContextMenuShortcut>Enter</ContextMenuShortcut>
              </ContextMenuItem>
              <ContextMenuItem @click="openRenameModal(file)">
                Rename
                <ContextMenuShortcut>F2</ContextMenuShortcut>
              </ContextMenuItem>
              <ContextMenuItem @click="deleteItem(file)" inset>
                Delete
                <ContextMenuShortcut>Del</ContextMenuShortcut>
              </ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem v-if="file.isFolder" @click="createNewItem(file)">
                New Item
                <ContextMenuShortcut>Ctrl+N</ContextMenuShortcut>
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        </li>
      </ul>
    </div>
  </div>
  
  <!-- Rename Modal -->
  <UModal v-model="isRenameModalOpen" prevent-close>
    <UCard :ui="{ ring: '', divide: 'divide-y divide-white dark:divide-gray-800'}">
    <template #header>
    Rename File
    </template>

      <UInput v-model="newFileName" type="text" placeholder="New file name" required class="px-6" />

    <template #footer>
        <div class="flex justify-end">
          <UButton type="button" @click="isRenameModalOpen = false" class="btn btn-secondary mr-2">Cancel</UButton>
          <UButton type="submit" class="btn btn-primary">Rename</UButton>
        </div>
    </template>
  </UCard>
  </UModal>
</template>


<script setup lang="ts">
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { generateFakeFiles } from '~/lib/utils';
import { ref, computed, watch } from 'vue';
import type { File } from '~/types/types';

const files = ref<File[]>([]);
const folderSelected = ref<number>(-1);
const breadcrumb = ref<{ id: number, name: string }[]>([]);

const isSearching = ref(false);
const isRenameModalOpen = ref(false);
const fileToRename = ref<File | null>(null);
const newFileName = ref<string>('');

// Filter files based on idParent
const filteredFiles = computed(() => {
  return files.value.filter(file => file.idParent === folderSelected.value);
});

// Watch for folder selection changes to update breadcrumb
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

// Update breadcrumb based on selected folder
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
}

// Handle item click to navigate folders or select files
function handleItemClick(file: File) {
  if (file.isFolder) {
    folderSelected.value = file.id;
  } else {
    console.log('File selected:', file);
  }
}

// Open item action
function openItem(file: File) {
  if (file.isFolder) {
    folderSelected.value = file.id;
  } else {
    console.log('Opening file:', file);
  }
}

// Open rename modal action
function openRenameModal(file: File) {
  fileToRename.value = file;
  newFileName.value = file.name;
  isRenameModalOpen.value = true;
}

// Rename file action
function renameFile() {
  if (fileToRename.value) {
    fileToRename.value.name = newFileName.value;
    isRenameModalOpen.value = false;
  }
}

// Delete item action
function deleteItem(file: File) {
  console.log('Deleting file:', file);
  files.value = files.value.filter(f => f.id !== file.id);
}

// Create new item action
function createNewItem(file: File) {
  console.log('Creating new item in folder:', file);
  const newItem: File = {
    id: Date.now(),
    name: 'New Item',
    date: new Date().toISOString(),
    isFolder: false,
    extension: 'txt',
    idParent: file.id
  };
  files.value.push(newItem);
}

// Generate 10 fake files
files.value = generateFakeFiles(10);

// Initialize breadcrumb
updateBreadcrumb(folderSelected.value);
</script>
