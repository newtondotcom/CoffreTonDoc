<template>
<div>
  <Progress v-model="progress" class="w-3/5" />
</div>
</template>

<script setup lang="ts">
const progress = ref(13)
</script>