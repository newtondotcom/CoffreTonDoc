<script setup lang="ts">
    const { t } = useI18n();

    definePageMeta({
        layout: false,
    });
</script>

<template>
    <div class="flex h-screen items-center justify-center">
        <Card class="mx-auto max-w-sm">
            <CardHeader>
                <CardTitle class="text-2xl">{{ $t('connect_us') }}</CardTitle>
                <CardDescription>
                    {{ $t('login_description') }}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <AuthEtherum />
            </CardContent>
        </Card>
    </div>
</template>
