<template>
    <vue-office-docx
        :src="docx"
        style="height: 100vh"
        @rendered="renderedHandler"
        @error="errorHandler"
    />
</template>

<script setup lang="ts">
    import VueOfficeDocx from '@vue-office/docx';
    import '@vue-office/docx/lib/index.css';
    Vue.component('vue-office-docx', VueOfficeDocx);
    const docx = 'http://static.shanhuxueyuan.com/test6.docx'; // Set the document URL

    function renderedHandler() {
        console.log('Render completed');
    }

    function errorHandler() {
        console.log('Render failed');
    }
</script>
