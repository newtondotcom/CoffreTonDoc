<template>
  <vue-office-excel
    :src="excel"
    :options="options"
    style="height: 100vh"
    @rendered="renderedHandler"
    @error="errorHandler"
  />
</template>

<script setup lang="ts">
import VueOfficeExcel from '@vue-office/excel';
import '@vue-office/excel/lib/index.css';
Vue.component('vue-office-excel', VueOfficeExcel);
const excel = 'http://static.shanhuxueyuan.com/demo/excel.xlsx'; // Set the Excel URL

function renderedHandler() {
  console.log('Render completed');
}

function errorHandler() {
  console.log('Render failed');
}

const options = {
  xls: false,
  minColLength: 0,
  minRowLength: 0,
  widthOffset: 10,
  heightOffset: 10,
  beforeTransformData: (workbookData: any) => {
    return workbookData;
  },
  transformData: (workbookData: any) => {
    return workbookData;
  },
};
</script>
