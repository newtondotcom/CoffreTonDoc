<template>
    <VueOfficeDocx
        :src="docx"
        style="height: 100vh"
        @rendered="renderedHandler"
        @error="errorHandler"
    />
</template>

<script setup lang="ts">
    import VueOfficeDocx from '@vue-office/docx';
    import '@vue-office/docx/lib/index.css';
    import type { PreviewFileProps } from '@/types/props';
    const docx = 'http://static.shanhuxueyuan.com/test6.docx';

    function renderedHandler() {
        console.log('Render completed');
    }

    function errorHandler() {
        console.log('Render failed');
    }
    const props = defineProps<PreviewFileProps>();
</script>
