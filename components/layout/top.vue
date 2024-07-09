<template>
    <!--  lg:hidden -->
    <div
        class="dark:bg-dark-background sticky top-0 z-[19] flex w-full items-center justify-between px-4 pb-5 pt-2 text-center"
    >
        <div
            class="relative flex min-w-0 select-none items-center pr-12 text-left font-bold lg:pr-6"
        >
            {{ $t('my_files') }}
        </div>
        <LayoutFilters :toogleSearch />
    </div>

    <ButtonCommand :toogleSearch :isSearching />
</template>

<script setup lang="ts">
const isSearching = ref(false);

function toogleSearch() {
    isSearching.value = !isSearching.value;
}
</script>
