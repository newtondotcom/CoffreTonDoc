<template>
    <TestArray />
</template>

<script setup lang="ts">
    import { useLoadingStore } from '@/stores/loading';
    const store = useLoadingStore();

    onMounted(() => {
        store.toggle();
        setTimeout(() => {
            store.toggle();
        }, 2000);
    });
</script>
