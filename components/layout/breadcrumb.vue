<template>
    <div class="flex flex-row justify-between items-center px-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink @click="navigateToRoot">
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator v-if="breadcrumb.length" />
          <BreadcrumbItem v-for="(crumb, index) in breadcrumb" :key="index">
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
  } from '@/components/ui/breadcrumb';
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from '@/components/ui/dropdown-menu';
  import { defineProps } from 'vue';
  
  defineProps({
    navigateToFolder: Function,
    navigateToRoot : Function,
    breadcrumb : Array
  });
  </script>
  