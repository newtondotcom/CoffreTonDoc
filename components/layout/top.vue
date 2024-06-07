<template>
    <!--  lg:hidden -->
<div class="sticky top-0 z-[19] flex w-full items-center justify-between bg-white pb-5 pt-2 px-4 text-center dark:bg-dark-background">
<div class="relative flex font-bold select-none items-center text-left min-w-0 lg:pr-6 pr-12">
    Mes fichiers
</div>
<div class="flex flex-row">
    <!-- SEARCH BAR -->
    <FolderPlus />
    <FilePlus />
</div>
</div>
</template>
<script setup lang="ts">
import { FolderPlus,FilePlus } from 'lucide-vue-next';

</script>