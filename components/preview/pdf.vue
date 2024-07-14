<template>
    <!--
    <vue-office-pdf
        :src="pdf"
        style="height: 100vh"
        @rendered="renderedHandler"
        @error="errorHandler"
    />
     -->
    <iframe :src="pdf" width="600" height="500"></iframe>
</template>

<script setup lang="ts">
    const pdf = 'http://static.shanhuxueyuan.com/test.pdf'; // Set the PDF URL
    /*
import VueOfficePdf from '@vue-office/pdf';

function renderedHandler() {
    console.log('Render completed');
}

function errorHandler() {
    console.log('Render failed');
}
*/
</script>
