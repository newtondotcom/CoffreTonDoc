<template>
  <vue-office-pdf
    :src="pdf"
    style="height: 100vh"
    @rendered="renderedHandler"
    @error="errorHandler"
  />
</template>

<script setup lang="ts">
import VueOfficePdf from '@vue-office/pdf';
const pdf = 'http://static.shanhuxueyuan.com/test.pdf'; // Set the PDF URL

function renderedHandler() {
  console.log('Render completed');
}

function errorHandler() {
  console.log('Render failed');
}
</script>
