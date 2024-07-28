<template>
    <!--  lg:hidden -->
    <div
        class="dark:bg-dark-background sticky top-0 z-[19] flex w-full items-center justify-between px-4 py-2 text-center"
    >
        <div class="ext-left relative flex min-w-0 select-none items-center text-xl font-bold">
            {{ $t('my_files') }}
        </div>
        <!--
        <LayoutFilters :toogleSearch />
        -->
    </div>

    <ButtonCommand :toogleSearch :isSearching />
</template>

<script setup lang="ts">
    const isSearching = ref(false);

    function toogleSearch() {
        isSearching.value = !isSearching.value;
    }
</script>
