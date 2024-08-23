<script setup lang="ts">
    import { onMounted, ref } from 'vue';
    import { columns } from './columns';
    import DataTable from './DataTable.vue';
    import type { File } from '@prisma/client';

    const data = ref<File[]>([]);

    async function getData(): Promise<File[]> {
        const body = {
            fileId: -1,
        };
        const data = await $fetch('/api/both/arborescence', {
            method: 'POST',
            body: JSON.stringify(body),
        });
        return data;
    }

    onMounted(async () => {
        data.value = await getData();
    });
</script>

<template>
    <div class="container mx-auto py-10">
        <DataTable :columns="columns" :data="data" />
    </div>
</template>
