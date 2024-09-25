<template>
    <div class="flex flex-row">
        <LayoutMenu />
        <slot />

        <div v-if="store.loading" class="absolute bottom-8 right-8">
            <div class="h-10 w-10 animate-ping rounded-full bg-violet-800"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { useLoadingStore } from '@/stores/loading';
    const store = useLoadingStore();
</script>
