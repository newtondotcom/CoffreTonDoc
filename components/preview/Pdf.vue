<template>
    <iframe :src="pdf" width="600" height="500"></iframe>
</template>

<script setup lang="ts">
    import type { PreviewFileProps } from '@/types/props';
    const pdf = 'http://static.shanhuxueyuan.com/test.pdf';
    const props = defineProps<PreviewFileProps>();
</script>
