<template>
  <div class="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
    <textarea
      v-model="text"
      class="w-[90vw] h-[90vh] p-4 text-sm dark:bg-dark-background dark:text-white"
    >
    </textarea>
  </div>
</template>

<script setup lang="ts">
const text = ref<string>('');
</script>

