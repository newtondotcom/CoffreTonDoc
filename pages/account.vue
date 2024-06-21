<template>
  <div>
    {{ $t("storage_quota") }}
    <Progress v-model="progress" class="w-3/5" />

    <MfaUnenrollment />
  </div>
</template>

<script setup lang="ts">
const progress = ref(13);
</script>
