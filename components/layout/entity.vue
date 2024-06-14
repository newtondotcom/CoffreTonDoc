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
        

    <Dialog>
    <DialogTrigger as-child>
        <ContextMenuItem @click="openRenameModal(file)">
          Rename
          <ContextMenuShortcut>F2</ContextMenuShortcut>
        </ContextMenuItem>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Edit profile</DialogTitle>
        <DialogDescription>
          Make changes to your profile here. Click save when you're done.
        </DialogDescription>
      </DialogHeader>
      <div class="grid gap-4 py-4">
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="name" class="text-right">
            Name
          </Label>
          <Input id="name" value="Pedro Duarte" class="col-span-3" />
        </div>
      </div>
      <DialogFooter>
        <Button type="submit" @click="renameFile">
          Save changes
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>

      <Dialog>
    <DialogTrigger as-child>
        <ContextMenuItem inset>
          Delete
          <ContextMenuShortcut>Del</ContextMenuShortcut>
        </ContextMenuItem>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Edit profile</DialogTitle>
        <DialogDescription>
          Make changes to your profile here. Click save when you're done.
        </DialogDescription>
      </DialogHeader>
      <div class="grid gap-4 py-4">
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="name" class="text-right">
            Name
          </Label>
          <Input id="name" value="Pedro Duarte" class="col-span-3" />
        </div>
      </div>
      <DialogFooter>
        <Button type="submit" @click="deleteItem(file)" >
          Save changes
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>

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
  