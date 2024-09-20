<template>
    <div>
        <Button
            @click="
                () => {
                    navigateTo('auth/login');
                }
            "
        >
            Go to auth
        </Button>
    </div>
</template>

<script setup lang="ts">
    definePageMeta({ layout: false });
</script>
