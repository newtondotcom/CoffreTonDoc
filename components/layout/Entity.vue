<template>
    <Dialog>
        <ContextMenu>
            <ContextMenuTrigger
                class="dark:hover:bg-dark-foreground flex w-full flex-row justify-between px-2.5 py-2 hover:bg-secondary"
            >
                <IconsDate :date="file.date" />
                <div class="flex w-[60%] flex-row items-center">
                    <div class="relative w-16 shrink-0">
                        <IconsFolder v-if="file.isFolder" />
                        <IconsThumbnail :extension="file.extension" v-else />
                    </div>
                    <div class="flex min-w-0 flex-col pl-2">
                        <div
                            class="mb-0.5 block cursor-text overflow-hidden text-ellipsis whitespace-nowrap pr-4 text-sm font-bold hover:underline lg:pr-0"
                        >
                            {{ file.name }}
                            <span v-if="!file.isFolder">.{{ file.extension }}</span>
                        </div>
                    </div>
                </div>
                <IconsSize :size="file.size" />
                <!--
                <IconsStatut :statut="file.statut" />
                -->
            </ContextMenuTrigger>
            <ContextMenuContent class="w-64 bg-white">
                <ContextMenuItem @click="openItem(file)">
                    {{ $t('open') }}
                    <ContextMenuShortcut>Enter</ContextMenuShortcut>
                </ContextMenuItem>

                <ContextMenuItem @click="download(file)">
                    {{ $t('download') }}
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
                    <ContextMenuItem v-if="!file.isFolder" @click="setState('replace')">
                        {{ $t('replace') }}
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
                <DialogTitle>{{ $t('new_file_inside') }}</DialogTitle>
                <DialogDescription>
                    {{ $t('enter_new_file_name') }}
                </DialogDescription>
            </DialogHeader>
            <div class="grid gap-4 py-4">
                <div class="grid grid-cols-4 items-center gap-4">
                    <Label for="file-name" class="my-2 text-right font-medium">
                        {{ $t('file_name') }}
                    </Label>
                    <Input id="file-name" class="col-span-3" v-model="newFileName" />
                </div>
                <div class="grid grid-cols-4 items-center gap-4">
                    <Label for="file-extension" class="my-2 text-right font-medium">
                        {{ $t('extension') }}
                    </Label>
                    <Input
                        id="file-extension"
                        class="col-span-3"
                        v-model="newFileExtension"
                        @keyup.enter="handleNewFileInside"
                    />
                </div>
            </div>
            <DialogFooter>
                <DialogClose as-child>
                    <Button @click="handleNewFileInside">
                        {{ $t('create') }}
                    </Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>

        <DialogContent v-if="stateDialog === 'newFolder'" class="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>{{ $t('new_folder_inside') }}</DialogTitle>
                <DialogDescription>
                    {{ $t('enter_new_folder_name') }}
                </DialogDescription>
            </DialogHeader>
            <div class="grid gap-4 py-4">
                <div class="grid grid-cols-4 items-center gap-4">
                    <Label for="newFolderName" class="my-2 text-right">
                        {{ $t('folder_name') }}
                    </Label>
                    <Input
                        id="newFolderName"
                        v-model="newFolderName"
                        class="col-span-3"
                        @keyup.enter="handleNewFolderInside"
                    />
                </div>
            </div>
            <DialogFooter>
                <DialogClose as-child>
                    <Button @click="handleNewFolderInside">
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
                    <Label for="newName" class="my-2 text-right">
                        {{ $t('new_name') }}
                    </Label>
                    <Input
                        id="newName"
                        v-model="newName"
                        class="col-span-3"
                        @keyup.enter="handleFileRename"
                    />
                </div>
            </div>
            <DialogFooter>
                <DialogClose as-child>
                    <Button @click="handleFileRename">
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

        <DialogContent v-if="stateDialog === 'replace'" class="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>{{ $t('replace') }}</DialogTitle>
                <DialogDescription>
                    {{ $t('replace_confirmation') }}
                </DialogDescription>
            </DialogHeader>

            <div class="grid grid-cols-4 items-center gap-4">
                <Label for="file-name" class="my-2 text-right font-medium">
                    {{ $t('file_name') }}
                </Label>
                <Input id="file-picture" type="file" @change="handleFileUpload" />
            </div>

            <DialogFooter>
                <DialogClose as-child>
                    <Button @click="replace(file.id)">
                        <div :disabled="fileValid || uploadloading" v-if="!uploadloading">
                            {{ $t('submit') }}
                        </div>
                        <div v-else class="ml-1 flex">
                            <svg
                                class="m-1 h-4 w-4 animate-spin"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    class="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    stroke-width="4"
                                ></circle>
                                <path
                                    class="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                ></path>
                            </svg>
                        </div>
                    </Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
    interface EntityProps {
        file: Object;
        openItem: Function;
        renameFile: Function;
        deleteItem: Function;
        createNewFileInside: Function;
        createNewFolderInside: Function;
    }
    const props = defineProps<EntityProps>();

    import { useToast } from '@/components/ui/toast/use-toast';
    const { toast } = useToast();

    import { allowedFileExtensions } from '~/utils/extensions';

    const newName = ref('');
    const newFileName = ref('');
    const newFileExtension = ref('');
    const newFolderName = ref('');
    const stateDialog = ref('');
    const uploadloading = ref(false);
    const fileLocal = ref(null);
    const fileValid = ref(false);

    function setState(newState) {
        stateDialog.value = newState;
    }

    async function replace(file) {
        uploadloading.value = true;
        const { idfinal, urlUpload } = await $fetch('/api/file/replace', {
            method: 'POST',
            body: {
                fileId: props.file.id,
                size: fileLocal.value.size,
            },
        });
        // Upload file
        uploadloading.value = false;
    }

    async function handleFileUpload(event) {
        fileLocal.value = event.target.files[0];
        if (fileLocal.value) {
            const fullName = fileLocal.value.name;
            const lastDot = fullName.lastIndexOf('.');
            newName.value = fullName.substring(0, lastDot);
            newFileExtension.value = fullName.substring(lastDot + 1);
            if (!(newFileExtension.value.trim() == props.file.extension.trim())) {
                toast({
                    title: 'Error',
                    description: 'File extension is not the same as the original file',
                    variant: 'destructive',
                });
            } else {
                fileValid.value = true;
                await replace(props.file.id);
            }
        }
    }

    async function handleNewFileInside() {
        if (!newFileName.value || !newFileExtension.value) {
            toast({
                title: 'Please specify a file name and extension',
                description: 'File name and extension are required to create a new file',
                variant: 'destructive',
            });
            return;
        }
        if (!allowedFileExtensions.includes(newFileExtension.value)) {
            toast({
                title: 'Invalid file extension',
                description: 'Please specify a valid file extension',
                variant: 'destructive',
            });
            return;
        }
        props.createNewFileInside(props.file.id, newFileName.value, newFileExtension.value);
    }

    async function handleNewFolderInside() {
        if (!newFolderName.value) {
            toast({
                title: 'Please specify a folder name',
                description: 'Folder name is required to create a new folder',
                variant: 'destructive',
            });
            return;
        }
        props.createNewFolderInside(props.file.id, newFolderName.value);
    }

    async function handleFileRename() {
        if (!newName.value) {
            toast({
                title: 'Please specify a new name',
                description: 'New name is required to rename the file',
                variant: 'destructive',
            });
            return;
        }
        props.renameFile(props.file.id, newName.value);
    }

    async function download(file) {
        const data = await $fetch('/api/file/download', {
            method: 'POST',
            body: {
                fileId: file.id,
            },
        });
        if (data.status === 200) {
            const blob = new Blob([data.file], { type: 'application/octet-stream' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = file.name;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } else {
            toast({
                title: 'Error',
                description: 'Error downloading file',
                variant: 'destructive',
            });
        }
    }
</script>
