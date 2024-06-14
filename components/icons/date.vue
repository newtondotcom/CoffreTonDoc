<template>
    <!-- Display the formatted date string -->
    <span>{{ new Date(date).toLocaleString() }}</span>
  </template>
  
  <script setup lang="ts">
defineProps({
    date: String
});
  </script>
  