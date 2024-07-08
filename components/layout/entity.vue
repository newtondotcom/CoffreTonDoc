<template>
  <Dialog>
    <ContextMenu>
      <ContextMenuTrigger
        class="w-full flex flex-row justify-between hover:bg-secondary dark:hover:bg-dark-foreground px-2.5 py-2"
      >
        <IconsDate :date="file.date" />
        <div class="flex flex-row w-[60%] items-center">
          <div class="relative w-16 shrink-0">
            <IconsFolder v-if="file.isFolder" />
            <IconsThumbnail :extension="file.extension" v-else />
          </div>
          <div class="flex flex-col pl-2 min-w-0">
            <div
              class="mb-0.5 block overflow-hidden text-ellipsis whitespace-nowrap text-sm font-bold lg:pr-0 pr-4 hover:underline cursor-text"
            >
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

        <DialogTrigger asChild>
          <ContextMenuItem @click="setState('replace')">
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
        <DialogTitle>{{ $t('rename_file') }}</DialogTitle>
        <DialogDescription>
          {{ $t('enter_new_file_name') }}
        </DialogDescription>
      </DialogHeader>
      <div class="grid gap-4 py-4">
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="file-name" class="text-right font-medium my-2">
            {{ $t('file_name') }}
          </Label>
          <Input id="file-name" class="col-span-3" v-model="newFileName" />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="file-extension" class="text-right font-medium my-2">
            {{ $t('extension') }}
          </Label>
          <Input
            id="file-extension"
            class="col-span-3"
            v-model="newFileExtension"
          />
        </div>
      </div>
      <DialogFooter>
        <DialogClose as-child>
          <Button @click="createNewFile(newFileName, newFileExtension)">
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
          <Label for="newFolderName" class="text-right my-2">
            {{ $t('folder_name') }}
          </Label>
          <Input
            id="newFolderName"
            v-model="newFolderName"
            class="col-span-3"
          />
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
          <Label for="newName" class="text-right my-2">
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
          <Label for="accessLevel" class="text-right my-2">
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

    <DialogContent v-if="stateDialog === 'replace'" class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{{ $t('replace') }}</DialogTitle>
        <DialogDescription>
          {{ $t('replace_confirmation') }}
        </DialogDescription>
      </DialogHeader>

      <div class="grid grid-cols-4 items-center gap-4">
        <Label for="file-name" class="text-right font-medium my-2">
          {{ $t('file_name') }}
        </Label>
        <Input id="file-picture" type="file" @change="handleFileUpload" />
      </div>

      <DialogFooter>
        <DialogClose as-child>
          <Button @click="replace(file.id)">
            <div :disabled="fileValid" v-if="!uploadloading">
              {{ $t('submit') }}
            </div>
            <div v-else class="ml-1 flex">
              <svg
                class="animate-spin h-4 w-4 m-1"
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
const props = defineProps({
  file: Object,
  openItem: Function,
  renameFile: Function,
  deleteItem: Function,
  createNewFile: Function,
  createNewFolder: Function,
  changeAccess: Function,
  replaceFile: Function,
});

import { assert } from '@vueuse/core';
import { useToast } from '@/components/ui/toast/use-toast';
const { toast } = useToast();
import { ToastAction } from '@/components/ui/toast';

const newName = ref('');
const newFileName = ref('');
const newFileExtension = ref('');
const newFolderName = ref('');
const accessLevel = ref('');
const stateDialog = ref('');
const uploadloading = ref(false);
const fileLocal = ref(null);
const fileValid = ref(false);

function setState(newState) {
  stateDialog.value = newState;
}

async function replace(file) {
  uploadloading.value = true;
  const url = await replaceFile(file);
  uploadloading.value = false;
}

function handleFileUpload(event) {
  fileLocal.value = event.target.files[0];
  if (fileLocal.value) {
    const fullName = fileLocal.value.name;
    const lastDot = fullName.lastIndexOf('.');
    newName.value = fullName.substring(0, lastDot);
    newFileExtension.value = fullName.substring(lastDot + 1);
    if (!assert(newFileExtension.value == props.file.extension)) {
      toast({
        title: 'Error',
        description: 'File extension is not the same as the original file',
        variant: 'destructive',
      });
    } else {
      fileValid.value = true;
    }
  }
}
</script>
