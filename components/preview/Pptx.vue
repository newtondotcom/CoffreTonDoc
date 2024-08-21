<template>
    <div class="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4"></div>
</template>

<script setup lang="ts">
    const url = 'https://scholar.harvard.edu/files/torman_personal/files/samplepptx.pptx';

    // convert to pdf and display pdf

    const props = defineProps<PreviewFileProps>();
</script>

<style scoped>
    .pb-3\/4 {
        padding-bottom: 75%;
    }
</style>
