<template>
    <div class="h-full w-full">
        <iframe
            :src="blobUrl"
            class="h-[100%] w-[100%]"
            frameborder="0"
            scrolling="yes"
            seamless="seamless"
        ></iframe>
    </div>
</template>

<script setup lang="ts">
    import type { PreviewFileProps } from '@/types/props';
    import { ref, onMounted } from 'vue';

    const props = defineProps<PreviewFileProps>();
    const blobUrl = ref('');

    onMounted(() => {
        if (props.blob) {
            const url = URL.createObjectURL(props.blob);
            blobUrl.value = url;
        }
    });
</script>
