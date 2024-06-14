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
          <ContextMenuItem>
            Rename
            <ContextMenuShortcut>F2</ContextMenuShortcut>
          </ContextMenuItem>
        </DialogTrigger>
        <DialogContent class="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Rename File</DialogTitle>
            <DialogDescription>
              Enter a new name for the file.
            </DialogDescription>
          </DialogHeader>
          <div class="grid gap-4 py-4">
            <div class="grid grid-cols-4 items-center gap-4">
              <Label for="newName" class="text-right">
                New Name
              </Label>
              <Input id="newName" v-model="newName" class="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" @click="renameFile(file, newName)">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger as-child>
          <ContextMenuItem>
            Delete
            <ContextMenuShortcut>Del</ContextMenuShortcut>
          </ContextMenuItem>
        </DialogTrigger>
        <DialogContent class="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete File</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this file? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="submit" @click="deleteItem(file)">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger as-child>
          <ContextMenuItem>
            Access
            <ContextMenuShortcut>Shift + A</ContextMenuShortcut>
          </ContextMenuItem>
        </DialogTrigger>
        <DialogContent class="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Change Access</DialogTitle>
            <DialogDescription>
              Modify the access permissions for this file.
            </DialogDescription>
          </DialogHeader>
          <div class="grid gap-4 py-4">
            <div class="grid grid-cols-4 items-center gap-4">
              <Label for="accessLevel" class="text-right">
                Access Level
              </Label>
              <Input id="accessLevel" v-model="accessLevel" class="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" @click="changeAccess(file, accessLevel)">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ContextMenuSeparator v-if="file.isFolder" />

      <Dialog v-if="file.isFolder">
        <DialogTrigger as-child>
          <ContextMenuItem>
            New File Inside
            <ContextMenuShortcut>Ctrl + N</ContextMenuShortcut>
          </ContextMenuItem>
        </DialogTrigger>
        <DialogContent class="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>New File</DialogTitle>
            <DialogDescription>
              Enter the name for the new file.
            </DialogDescription>
          </DialogHeader>
          <div class="grid gap-4 py-4">
            <div class="grid grid-cols-4 items-center gap-4">
              <Label for="newFileName" class="text-right">
                File Name
              </Label>
              <Input id="newFileName" v-model="newFileName" class="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" @click="createNewFile(file, 'file', newFileName)">
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog v-if="file.isFolder">
        <DialogTrigger as-child>
          <ContextMenuItem>
            New Folder Inside
            <ContextMenuShortcut>Ctrl + N</ContextMenuShortcut>
          </ContextMenuItem>
        </DialogTrigger>
        <DialogContent class="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>New Folder</DialogTitle>
            <DialogDescription>
              Enter the name for the new folder.
            </DialogDescription>
          </DialogHeader>
          <div class="grid gap-4 py-4">
            <div class="grid grid-cols-4 items-center gap-4">
              <Label for="newFolderName" class="text-right">
                Folder Name
              </Label>
              <Input id="newFolderName" v-model="newFolderName" class="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" @click="createNewFolder(file, 'folder', newFolderName)">
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ContextMenuContent>
  </ContextMenu>
</template>

<script setup lang="ts">
defineProps({
  file: Object,
  openItem: Function,
  renameFile: Function,
  deleteItem: Function,
  createNewFile: Function,
  createNewFolder : Function,
  changeAccess: Function,
});
const newName = ref('');
const newFileName = ref('');
const newFolderName = ref('');
const accessLevel = ref('');
</script>
