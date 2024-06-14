<template>
    <ContextMenu>
      <ContextMenuTrigger class="w-full flex flex-row justify-between">
        <IconsDate :date="file.date" />
        <div class="flex flex-row w-[60%] items-center">
          <div class="relative w-16 shrink-0">
            <IconsFolder v-if="file.isFolder" />
            <IconsThumbnail :extension="file.extension" v-else />
          </div>
          <div class="flex flex-col pl-2 min-w-0">
            <div class="mb-0.5 block overflow-hidden text-ellipsis whitespace-nowrap text-sm font-bold lg:pr-0 pr-4 hover:underline cursor-text">
              {{ file.name }}
            </div>
          </div>
        </div>
        <IconsSize :size="file.size" />
        <IconsStatut :statut="file.statut" />
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
  </template>
  
  <script setup lang="ts">

  defineProps({
    file: Object,
    openItem: Function,
    openRenameModal: Function,
    deleteItem: Function,
    createNewItem: Function,
  });
  </script>
  