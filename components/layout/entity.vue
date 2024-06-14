<template>
<Dialog>
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
            <ContextMenuItem @click="setState('open')">
                Open
                <ContextMenuShortcut>Enter</ContextMenuShortcut>
            </ContextMenuItem>

            <ContextMenuItem @click="setState('rename')">
                Rename
                <ContextMenuShortcut>F2</ContextMenuShortcut>
            </ContextMenuItem>


      <DialogTrigger asChild>
            <ContextMenuItem @click="setState('delete')">
                Delete
                <ContextMenuShortcut>Del</ContextMenuShortcut>
            </ContextMenuItem>
      </DialogTrigger>

      <DialogTrigger asChild>
            <ContextMenuItem @click="setState('access')">
                Access
                <ContextMenuShortcut>Shift + A</ContextMenuShortcut>
            </ContextMenuItem>
      
      </DialogTrigger>

            <ContextMenuSeparator v-if="file.isFolder" />


      <DialogTrigger v-if="file.isFolder" asChild>
            <ContextMenuItem @click="setState('newFile')">
                New File Inside
                <ContextMenuShortcut>Ctrl + N</ContextMenuShortcut>
            </ContextMenuItem>
      </DialogTrigger>


      <DialogTrigger v-if="file.isFolder" asChild>
            <ContextMenuItem @click="setState('newFolder')">
                New Folder Inside
                <ContextMenuShortcut>Ctrl + N</ContextMenuShortcut>
            </ContextMenuItem>
      </DialogTrigger>
        </ContextMenuContent>

    </ContextMenu>

    <DialogContent v-if='stateDialog=="newFile"' class="sm:max-w-[425px]">
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
        <DialogClose as-child>
            <Button type="submit" @click.prevent="createNewFolder(file, 'folder', newFolderName)">
                Create
            </Button>
          </DialogClose>
        </DialogFooter>
    </DialogContent>

    <DialogContent v-if="stateDialog === 'newFolder'" class="sm:max-w-[425px]">
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
        <DialogClose as-child>
            <Button type="submit" @click.prevent="createNewFile(file, 'file', newFileName)">
                Create
            </Button>
          </DialogClose>
        </DialogFooter>
    </DialogContent>

    <DialogContent v-if="stateDialog === 'rename'" class="sm:max-w-[425px]">
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
        <DialogClose as-child>
            <Button type="submit" @click.prevent="changeAccess(file, accessLevel)">
                Save Changes
            </Button>
          </DialogClose>
        </DialogFooter>
    </DialogContent>

    <DialogContent v-if="stateDialog === 'delete'" class="sm:max-w-[425px]">
        <DialogHeader>
            <DialogTitle>Delete File</DialogTitle>
            <DialogDescription>
                Are you sure you want to delete this file? This action cannot be undone.
            </DialogDescription>
        </DialogHeader>
        <DialogFooter>
        <DialogClose as-child>
            <Button type="submit" @click.prevent="deleteItem(file)">
                Delete
            </Button>
          </DialogClose>
        </DialogFooter>
    </DialogContent>

    <DialogContent v-if="stateDialog === 'access'" class="sm:max-w-[425px]">
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
        <DialogClose as-child>
            <Button type="submit" @click.prevent="renameFile(file, newName)">
                Save Changes
            </Button>
          </DialogClose>
        </DialogFooter>
    </DialogContent>
</Dialog>
</template>

<script setup lang="ts">
defineProps({
  file: Object,
  openItem: Function,
  renameFile: Function,
  deleteItem: Function,
  createNewFile: Function,
  createNewFolder: Function,
  changeAccess: Function,
});

const newName = ref('');
const newFileName = ref('');
const newFolderName = ref('');
const accessLevel = ref('');
const stateDialog = ref('newFile'); // Default state
const showDialog = ref(true);

function setState(newState) {
  stateDialog.value = newState;
}

watch(() => stateDialog, () => {
  showDialog.value = true;
});

function preventDefaultEvent(event: Event) {
  event.preventDefault();
}

function test() {
  console.log('test');
}
</script>
