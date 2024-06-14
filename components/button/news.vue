<template>
  <div class="p-4">
    <!-- Dialog for Creating Folder -->
    <Dialog>
      <DialogTrigger as-child>
        <Button variant="secondary" class="mx-2"><FolderPlus /></Button>
      </DialogTrigger>
      <DialogContent class="sm:max-w-[425px] p-6 rounded-lg shadow-lg bg-white">
        <DialogHeader>
          <DialogTitle class="text-lg font-semibold">Create Folder</DialogTitle>
          <DialogDescription class="text-sm text-gray-500">
            Specify the name of the new folder.
          </DialogDescription>
        </DialogHeader>
        <div class="grid gap-4 py-4">
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="folder-name" class="text-right font-medium">
              Folder Name
            </Label>
            <Input id="folder-name" class="col-span-3"/>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">
            Create Folder
          </Button>
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
          <DialogTitle class="text-lg font-semibold">Create File</DialogTitle>
          <DialogDescription class="text-sm text-gray-500">
            Specify the name and extension of the new file.
          </DialogDescription>
        </DialogHeader>
        <div class="py-4 flex flex-col space-y-4">
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="file-name" class="text-right font-medium">
              File Name
            </Label>
            <Input id="file-name" class="col-span-3"/>
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="file-extension" class="text-right font-medium">
              Extension
            </Label>
            <Input id="file-extension" class="col-span-3"/>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">
            Create File
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { FolderPlus, FilePlus } from 'lucide-vue-next';
</script>
