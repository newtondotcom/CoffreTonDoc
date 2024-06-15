<template>
  <div class="p-4">
    <!-- Dialog for Creating Folder -->
    <Dialog>
      <DialogTrigger as-child>
        <Button variant="secondary" class="mx-2"><FolderPlus /></Button>
      </DialogTrigger>
      <DialogContent class="sm:max-w-[425px] p-6 rounded-lg shadow-lg bg-white">
        <DialogHeader>
          <DialogTitle class="text-lg font-semibold">{{ $t('create_folder') }}</DialogTitle>
          <DialogDescription class="text-sm text-gray-500">
            {{ $t('specify_names') }}
          </DialogDescription>
        </DialogHeader>
        <div class="grid gap-4 py-4">
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="folder-name" class="text-right font-medium">
              {{ $t('folder_name') }}
            </Label>
            <Input id="folder-name" class="col-span-3" v-model="folderName"/>
          </div>
        </div>
        <DialogFooter>
            <DialogClose as-child>
          <Button @click="createNewFolder(folderName)">{{ $t('create_folder') }}</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Dialog for Creating File -->
    <Dialog>
      <DialogTrigger as-child>
        <Button variant="secondary" class="mx-2"><FilePlus /></Button>
      </DialogTrigger>
      <DialogContent class="sm:max-w-[425px] p-6 rounded-lg shadow-lg bg-white">
        <DialogHeader>
          <DialogTitle class="text-lg font-semibold">{{ $t('create_file') }}</DialogTitle>
          <DialogDescription class="text-sm text-gray-500">{{ $t('specify_file_name') }}
          </DialogDescription>
        </DialogHeader>
        <div class="py-4 flex flex-col space-y-4">
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="file-name" class="text-right font-medium">
              {{ $t('file_name') }}
            </Label>
            <Input id="file-name" class="col-span-3" v-model="fileName"/>
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="file-extension" class="text-right font-medium">
              {{ $t('extension') }}
            </Label>
            <Input id="file-extension" class="col-span-3" v-model="fileExtension"/>
          </div>
        </div>
        <DialogFooter>
            <DialogClose as-child>
          <Button @click="createNewFile(fileName,fileExtension)">{{ $t('create_file') }}</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { FolderPlus, FilePlus } from 'lucide-vue-next';
defineProps({
  createNewFile: Function,
  createNewFolder : Function,
  filteredFiles : Object
});

// Filter to see if the name is empty or already in use
// Manage access

const folderName = ref('');
const fileName = ref('');
const fileExtension = ref('');

</script>
