<template>
  <div
    class="w-[15%] h-full flex flex-col justify-between"
    style="height: 100vh"
  >
    <div class="text-2xl font-extrabold px-6 py-4 text-primary">
      CoffreTonDoc
      <div class="text-xs text-gray-500 dark:text-white flex flex-col">
        <div class="flex">{{ $t("made_in") }}</div>
        <div class="flex">{{ $t("hosted_in") }}</div>
      </div>
    </div>
    <LayoutLinks />
    <div class="flex flex-row w-full justify-between px-4">
      <ButtonColorMode />
      <ButtonLocale />
    </div>
    <LayoutHi />
  </div>
</template>

<script setup lang="ts">
</script>
