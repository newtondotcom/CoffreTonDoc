<template>
    <div class="flex items-center overflow-x-auto pb-3 pl-4">
        <button class="mr-2 inline-block rounded-xl bg-light-background py-2 px-3.5 dark:bg-2x-dark-foreground">
            <div class="flex items-center">
                <Search />
                <span class="ml-2 text-sm font-bold">Splotlight</span>
            </div>
        </button>
        <button class="mr-2 inline-block rounded-xl bg-light-background py-2 px-3.5 dark:bg-2x-dark-foreground">
            <div class="flex items-center">
                <Filter />
                <span class="ml-2 text-sm font-bold">My files</span>
            </div>
        </button>
        <button class="mr-2 inline-block rounded-xl bg-light-background py-2 px-3.5 dark:bg-2x-dark-foreground">
            <div class="flex items-center">
                <Upload />
                <span class="ml-2 text-sm font-bold">Upload / Create</span>
            </div>
        </button>
        <button class="mr-2 inline-block rounded-xl bg-light-background py-2 px-3.5 dark:bg-2x-dark-foreground">
            <div class="flex items-center">
                <SquareCheckBig />
                <span class="ml-2 text-sm font-bold">Select</span>
            </div>
        </button>
        <button class="mr-2 inline-block rounded-xl bg-light-background py-2 px-3.5 dark:bg-2x-dark-foreground">
            <div class="flex items-center">
                <FolderKanban />
                <span class="ml-2 text-sm font-bold">View</span>
            </div>
        </button>
    </div>
</template>

<script setup lang="ts">
import { Search,Filter,Upload, SquareCheckBig, FolderKanban} from 'lucide-vue-next';
</script>