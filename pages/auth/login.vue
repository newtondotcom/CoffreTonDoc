<script setup lang="ts">
    import { useToast } from '@/components/ui/toast/use-toast';
    const toast = useToast();
    const { locale, setLocale } = useI18n();
    const { t } = useI18n();

    import errorCodes from '~/utils/codes';

    definePageMeta({
        layout: false,
        auth: {
            unauthenticatedOnly: true,
            navigateAuthenticatedTo: '/platform',
        },
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
                <AuthWallet />
            </CardContent>
        </Card>
    </div>
</template>
