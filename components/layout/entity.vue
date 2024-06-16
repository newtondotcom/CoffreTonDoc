<template>
<Dialog>
    <ContextMenu>
        <ContextMenuTrigger class="w-full flex flex-row justify-between hover:bg-secondary dark:hover:bg-dark-foreground px-2.5 py-2">
            <IconsDate :date="file.date" />
            <div class="flex flex-row w-[60%] items-center">
                <div class="relative w-16 shrink-0">
                    <IconsFolder v-if="file.isFolder" />
                    <IconsThumbnail :extension="file.extension" v-else />
                </div>
                <div class="flex flex-col pl-2 min-w-0">
                    <div class="mb-0.5 block overflow-hidden text-ellipsis whitespace-nowrap text-sm font-bold lg:pr-0 pr-4 hover:underline cursor-text">
                        {{ file.name }}
                        <span v-if="!file.isFolder">.{{ file.extension }}</span>
                    </div>
                </div>
            </div>
            <IconsSize :size="file.size" />
            <IconsStatut :statut="file.statut" />
        </ContextMenuTrigger>
        <ContextMenuContent class="w-64 bg-white">
            <ContextMenuItem @click="setState('open')">
                {{ $t('open') }}
                <ContextMenuShortcut>Enter</ContextMenuShortcut>
            </ContextMenuItem>

            <DialogTrigger asChild>
                <ContextMenuItem @click="setState('rename')">
                    {{ $t('rename') }}
                    <ContextMenuShortcut>F2</ContextMenuShortcut>
                </ContextMenuItem>
            </DialogTrigger>

            <DialogTrigger asChild>
                <ContextMenuItem @click="setState('delete')">
                    {{ $t('delete') }}
                    <ContextMenuShortcut>Del</ContextMenuShortcut>
                </ContextMenuItem>
            </DialogTrigger>

            <DialogTrigger asChild>
                <ContextMenuItem @click="setState('access')">
                    {{ $t('access') }}
                    <ContextMenuShortcut>Shift + A</ContextMenuShortcut>
                </ContextMenuItem>
            </DialogTrigger>

            <ContextMenuSeparator v-if="file.isFolder" />

            <DialogTrigger v-if="file.isFolder" asChild>
                <ContextMenuItem @click="setState('newFile')">
                    {{ $t('new_file_inside') }}
                    <ContextMenuShortcut>Ctrl + N</ContextMenuShortcut>
                </ContextMenuItem>
            </DialogTrigger>

            <DialogTrigger v-if="file.isFolder" asChild>
                <ContextMenuItem @click="setState('newFolder')">
                    {{ $t('new_folder_inside') }}
                    <ContextMenuShortcut>Ctrl + N</ContextMenuShortcut>
                </ContextMenuItem>
            </DialogTrigger>
        </ContextMenuContent>
    </ContextMenu>

    <DialogContent v-if="stateDialog == 'newFile'" class="sm:max-w-[425px]">
        <DialogHeader>
            <DialogTitle>{{ $t('rename_file') }}</DialogTitle>
            <DialogDescription>
                {{ $t('enter_new_file_name') }}
            </DialogDescription>
        </DialogHeader>
        <div class="grid gap-4 py-4">
            <div class="grid grid-cols-4 items-center gap-4">
                <Label for="newFileName" class="text-right">
                    {{ $t('file_name') }}
                </Label>
                <Input id="newFileName" v-model="newFileName" class="col-span-3" />
            </div>
        </div>
        <DialogFooter>
            <DialogClose as-child>
                <Button @click="createNewFile(file, 'file', newFileName)">
                    {{ $t('create') }}
                </Button>
            </DialogClose>
        </DialogFooter>
    </DialogContent>

    <DialogContent v-if="stateDialog === 'newFolder'" class="sm:max-w-[425px]">
        <DialogHeader>
            <DialogTitle>{{ $t('new_folder') }}</DialogTitle>
            <DialogDescription>
                {{ $t('enter_new_folder_name') }}
            </DialogDescription>
        </DialogHeader>
        <div class="grid gap-4 py-4">
            <div class="grid grid-cols-4 items-center gap-4">
                <Label for="newFolderName" class="text-right">
                    {{ $t('folder_name') }}
                </Label>
                <Input id="newFolderName" v-model="newFolderName" class="col-span-3" />
            </div>
        </div>
        <DialogFooter>
            <DialogClose as-child>
                <Button @click="createNewFolder(file, 'folder', newFolderName)">
                    {{ $t('create') }}
                </Button>
            </DialogClose>
        </DialogFooter>
    </DialogContent>

    <DialogContent v-if="stateDialog === 'rename'" class="sm:max-w-[425px]">
        <DialogHeader>
            <DialogTitle>{{ $t('rename_file') }}</DialogTitle>
            <DialogDescription>
                {{ $t('enter_new_file_name') }}
            </DialogDescription>
        </DialogHeader>
        <div class="grid gap-4 py-4">
            <div class="grid grid-cols-4 items-center gap-4">
                <Label for="newName" class="text-right">
                    {{ $t('new_name') }}
                </Label>
                <Input id="newName" v-model="newName" class="col-span-3" />
            </div>
        </div>
        <DialogFooter>
            <DialogClose as-child>
                <Button @click="renameFile(file.id, newName)">
                    {{ $t('save_changes') }}
                </Button>
            </DialogClose>
        </DialogFooter>
    </DialogContent>

    <DialogContent v-if="stateDialog === 'access'" class="sm:max-w-[425px]">
        <DialogHeader>
            <DialogTitle>{{ $t('change_access') }}</DialogTitle>
            <DialogDescription>
                {{ $t('modify_access_permissions') }}
            </DialogDescription>
        </DialogHeader>
        <div class="grid gap-4 py-4">
            <div class="grid grid-cols-4 items-center gap-4">
                <Label for="accessLevel" class="text-right">
                    {{ $t('access_level') }}
                </Label>
                <Input id="accessLevel" v-model="accessLevel" class="col-span-3" />
            </div>
        </div>
        <DialogFooter>
            <DialogClose as-child>
                <Button @click="changeAccess(file, accessLevel)">
                    {{ $t('save_changes') }}
                </Button>
            </DialogClose>
        </DialogFooter>
    </DialogContent>

    <DialogContent v-if="stateDialog === 'delete'" class="sm:max-w-[425px]">
        <DialogHeader>
            <DialogTitle>{{ $t('delete_file') }}</DialogTitle>
            <DialogDescription>
                {{ $t('delete_confirmation') }}
            </DialogDescription>
        </DialogHeader>
        <DialogFooter>
            <DialogClose as-child>
                <Button @click="deleteItem(file.id)">
                    {{ $t('delete') }}
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
const stateDialog = ref("");

function setState(newState) {
    stateDialog.value = newState;
}
</script>
