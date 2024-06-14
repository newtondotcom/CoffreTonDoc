<template>
    <div class="flex items-center overflow-x-auto pb-3 pl-4">
        <Button variant="secondary" class="mx-2">
            <Search />
            <span class="ml-2 text-sm font-bold">Splotlight</span>
        </Button>
        <Button variant="secondary" class="mx-2">
            <Filter />
            <span class="ml-2 text-sm font-bold">My files</span>
        </Button>
        <Button variant="secondary" class="mx-2">
            <Upload />
            <span class="ml-2 text-sm font-bold">Upload / Create</span>
        </Button>
        <Button variant="secondary" class="mx-2">
            <SquareCheckBig />
            <span class="ml-2 text-sm font-bold">Select</span>
        </Button>
        <Button variant="secondary" class="mx-2">
            <FolderKanban />
            <span class="ml-2 text-sm font-bold">View</span>
        </Button>
    </div>
</template>

<script setup lang="ts">
import { Search, Filter, Upload, SquareCheckBig, FolderKanban } from 'lucide-vue-next';
</script>