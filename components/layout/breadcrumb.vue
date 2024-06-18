<template>
  <div
    class="flex flex-row justify-between items-center px-4 border b-1 rounded-xl my-2 py-2 text-sm"
  >
    <span class="opacity-50">{{ $t("breadcrumb_path") }} : </span>
    <Breadcrumb class="ml-2">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink @click="navigateToRoot" class="cursor-pointer">
            {{ $t("breadcrumb_home") }}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator v-if="breadcrumb.length" />
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
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

defineProps({
  navigateToFolder: Function,
  navigateToRoot: Function,
  breadcrumb: Array,
});
</script>
