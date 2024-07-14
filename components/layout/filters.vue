<template>
    <div class="flex items-center overflow-x-auto pb-3 pl-4 lg:hidden">
        <Button variant="secondary" class="mx-2" @click="toogleSearch">
            <Search />
            <span class="ml-2 text-sm font-bold">{{ $t('spotlight') }}</span>
        </Button>
        <Button variant="secondary" class="mx-2">
            <Filter />
            <span class="ml-2 text-sm font-bold">{{ $t('my_files') }}</span>
        </Button>
        <Button variant="secondary" class="mx-2">
            <Upload />
            <span class="ml-2 text-sm font-bold">{{ $t('upload_create') }}</span>
        </Button>
        <Button variant="secondary" class="mx-2">
            <SquareCheckBig />
            <span class="ml-2 text-sm font-bold">{{ $t('select') }}</span>
        </Button>
        <Button variant="secondary" class="mx-2">
            <FolderKanban />
            <span class="ml-2 text-sm font-bold">{{ $t('view') }}</span>
        </Button>
    </div>
    <div class="relative hidden w-full max-w-sm items-center lg:block">
        <Input
            id="search"
            type="text"
            placeholder="Search..."
            class="pl-10"
            @focus="toogleSearch"
        />
        <span class="absolute inset-y-0 start-0 flex items-center justify-center px-2">
            <MagnifyingGlassIcon class="size-6 text-muted-foreground" />
        </span>
    </div>
</template>

<script setup lang="ts">
    import { Search, Filter, Upload, SquareCheckBig, FolderKanban } from 'lucide-vue-next';
    import { MagnifyingGlassIcon } from '@radix-icons/vue';
    defineProps({
        toogleSearch: Function,
        isSearching: Boolean,
    });
</script>
