<template>
    <!-- Display the formatted date string -->
    <span class="flex justify-center items-center ">{{ new Date(date).toLocaleString() }}</span>
  </template>
  
  <script setup lang="ts">
defineProps({
    date: String
});
  </script>
  