<template>
<div class="flex items-center overflow-x-auto pb-3 pl-4">
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
</template>

<script lang="ts">
import {
    Search,
    Filter,
    Upload,
    SquareCheckBig,
    FolderKanban
} from 'lucide-vue-next';
defineProps({
    toogleSearch: Function,
    isSearching: Boolean
});
</script>
