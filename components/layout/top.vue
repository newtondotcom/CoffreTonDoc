<template>
  <!--  lg:hidden -->
  <div
    class="sticky top-0 z-[19] flex w-full items-center justify-between pb-5 pt-2 px-4 text-center dark:bg-dark-background"
  >
    <div
      class="relative flex font-bold select-none items-center text-left min-w-0 lg:pr-6 pr-12"
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
