<template>
    <div v-if="icon" class="flex h-14 w-14 flex-col items-center justify-center">
        <img
            :src="`/icons/${icon}`"
            draggable="false"
            :alt="extension"
            class="h-full w-full object-contain text-black dark:text-white"
        />
    </div>
    <div
        v-else
        class="text-shadow flex h-14 w-14 items-center justify-center text-2xl font-bold text-white"
    >
        {{ extension }}
    </div>
</template>

<style>
    .text-shadow {
        text-shadow:
            2px 0 rgb(0, 0, 0),
            -2px 0 rgb(0, 0, 0),
            0 2px rgb(0, 0, 0),
            0 -2px rgb(0, 0, 0),
            1px 1px rgb(0, 0, 0),
            -1px -1px rgb(0, 0, 0),
            1px -1px rgb(0, 0, 0),
            -1px 1px rgb(0, 0, 0);
        letter-spacing: 5px;
    }
</style>

<script setup lang="ts">
    interface ThumbnailProps {
        extension: string;
    }
    const props = defineProps<ThumbnailProps>();

    import { iconMapping } from '~/utils/extensions';

    const icon = iconMapping[props.extension];
</script>
