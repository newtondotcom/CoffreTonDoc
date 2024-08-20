<template>
    <div
        class="b-1 my-2 flex flex-row items-center justify-between rounded-xl border px-4 py-1 text-sm"
    >
        <!-- <span class="opacity-50">{{ $t('breadcrumb_path') }} :</span> -->
        <Breadcrumb class="ml-2">
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink @click="() => navigateToRoot()" class="cursor-pointer">
                        {{ $t('breadcrumb_home') }}
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator v-if="breadcrumb?.length" />
                <BreadcrumbItem
                    v-for="(crumb, index) in breadcrumb"
                    :key="index"
                    class="cursor-pointer"
                >
                    <BreadcrumbLink @click="navigateToFolder(crumb.id)">
                        {{ crumb.name }}
                    </BreadcrumbLink>
                    <BreadcrumbSeparator v-if="index < breadcrumb.length - 1" />
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    </div>
</template>

<script setup lang="ts">
    interface BreadcrumbProps {
        navigateToFolder: Function;
        navigateToRoot: Function;
        breadcrumb: Array<{
            id: number;
            name: string;
        }>;
    }
    const props = defineProps<BreadcrumbProps>();
</script>
