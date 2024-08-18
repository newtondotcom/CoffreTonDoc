<template>
    <div class="p-4">
        <!-- Dialog for Creating Folder -->
        <Dialog>
            <DialogTrigger as-child>
                <Button variant="secondary" class="mx-2"><FolderPlus /></Button>
            </DialogTrigger>
            <DialogContent class="rounded-lg p-6 shadow-lg sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle class="text-lg font-semibold">
                        {{ $t('create_folder') }}
                    </DialogTitle>
                    <DialogDescription class="text-sm text-gray-500">
                        {{ $t('specify_names') }}
                    </DialogDescription>
                </DialogHeader>
                <div class="grid gap-4 py-4">
                    <div class="grid grid-cols-4 items-center gap-4">
                        <Label for="folder-name" class="my-2 text-right font-medium">
                            {{ $t('folder_name') }}
                        </Label>
                        <Input
                            id="folder-name"
                            class="col-span-3"
                            v-model="folderName"
                            @keyup.enter="handleNewFolder"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose as-child>
                        <Button @click="handleNewFolder">{{ $t('create_folder') }}</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        <!-- Dialog for Creating File -->
        <Dialog>
            <DialogTrigger as-child>
                <Button variant="secondary" class="mx-2"><FilePlus /></Button>
            </DialogTrigger>
            <DialogContent class="rounded-lg p-6 shadow-lg sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle class="text-lg font-semibold">{{ $t('create_file') }}</DialogTitle>
                    <DialogDescription class="text-sm text-gray-500">
                        {{ $t('specify_file_name') }}
                    </DialogDescription>
                </DialogHeader>
                <div class="flex flex-col space-y-4 py-4">
                    <div class="grid grid-cols-4 items-center gap-4">
                        <Label for="file-name" class="my-2 text-right font-medium">
                            {{ $t('file_name') }}
                        </Label>
                        <Input id="file-name" class="col-span-3" v-model="fileName" />
                    </div>
                    <div class="grid grid-cols-4 items-center gap-4">
                        <Label for="file-extension" class="my-2 text-right font-medium">
                            {{ $t('extension') }}
                        </Label>
                        <Input
                            id="file-extension"
                            class="col-span-3"
                            v-model="fileExtension"
                            @keyup.enter="handleNewFile"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose as-child>
                        <Button @click="handleNewFile">{{ $t('create_file') }}</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
</template>

<script setup lang="ts">
    const props = defineProps({
        createNewFileInside: Function,
        createNewFolderInside: Function,
        selectedFolder: Number,
    });

    import { useToast } from '@/components/ui/toast/use-toast';
    const { toast } = useToast();

    import { FolderPlus, FilePlus } from 'lucide-vue-next';
    import { allowedFileExtensions } from '~/utils/extensions';

    // Filter to see if the name is empty or already in use
    // Restrict allowed file extension

    async function handleNewFile() {
        if (!fileName.value || !fileExtension.value) {
            toast({
                title: 'Please specify a file name and extension',
                description: 'File name and extension are required to create a new file',
                variant: 'destructive',
            });
            return;
        }
        if (!allowedFileExtensions.includes(fileExtension.value)) {
            toast({
                title: 'Invalid file extension',
                description: 'Please specify a valid file extension',
                variant: 'destructive',
            });
            return;
        }
        props.createNewFileInside(props.selectedFolder, fileName.value, fileExtension.value);
    }

    async function handleNewFolder() {
        if (!folderName.value) {
            toast({
                title: 'Please specify a folder name',
                description: 'Folder name is required to create a new folder',
                variant: 'destructive',
            });
            return;
        }
        props.createNewFolderInside(props.selectedFolder, folderName.value);
    }

    const folderName = ref('');
    const fileName = ref('');
    const fileExtension = ref('');
</script>
