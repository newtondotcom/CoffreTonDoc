<template>
    <div class="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
        <!--
        <textarea
            v-model="text"
            class="dark:bg-dark-background h-[90vh] w-[90vw] p-4 text-sm dark:text-white"
        >
        </textarea>
        -->
        <iframe :src="pdf" width="600" height="500"></iframe>
    </div>
</template>

<script setup lang="ts">
    import type { PreviewFileProps } from '@/types/props';
    const text = ref<string>('');

    const props = defineProps<PreviewFileProps>();
</script>
