<template>
    <span class="flex h-auto w-20 items-center justify-center text-center">
        {{
            size < 1000
                ? `${size} B`
                : size < 1000000
                  ? `${(size / 1000).toFixed(2)} KB`
                  : size < 1000000000
                    ? `${(size / 1000000).toFixed(2)} MB`
                    : `${(size / 1000000000).toFixed(2)} GB`
        }}
    </span>
</template>

<script setup lang="ts">
    interface SizeProps {
        size: Number;
    }
    const props = defineProps<SizeProps>();
</script>
