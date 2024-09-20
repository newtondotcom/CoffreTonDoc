<template>
    <span class="flex h-auto w-full items-center justify-center text-center">
        {{ formatted }}
    </span>
</template>

<script setup lang="ts">
    interface SizeProps {
        size: number;
    }
    const props = defineProps<SizeProps>();
    import { filesize } from 'filesize';
    const formatted = filesize(props.size, { round: 0 });
</script>
