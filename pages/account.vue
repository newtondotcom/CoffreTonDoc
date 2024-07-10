<template>
    <div>
        {{ $t('storage_quota') }}
        <Progress v-model="quota" class="w-3/5" />
    </div>
</template>

<script setup lang="ts">
const quota = ref(13);
</script>
