<template>
<div class="flex-1 mx-2 my-4">
    <div class="grid items-start px-2 text-sm font-medium lg:px-1">
        <NuxtLink to="/platform" class="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
            <Home class="h-4 w-4" />
            {{ $t('links_my_files')}}
        </NuxtLink>
        <NuxtLink to="/account" class="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
            <Settings class="h-4 w-4" />
            {{ $t('links_my_account')}}
            <Badge class="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-secondary">
                6
            </Badge>
        </NuxtLink>
    </div>
</div>
</template>

<script setup lang="ts">
import {
    Home,
    Settings
} from 'lucide-vue-next';
</script>
