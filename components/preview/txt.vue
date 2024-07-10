<template>
    <div class="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
        <textarea
            v-model="text"
            class="dark:bg-dark-background h-[90vh] w-[90vw] p-4 text-sm dark:text-white"
        >
        </textarea>
    </div>
</template>

<script setup lang="ts">
const text = ref<string>('');
</script>
