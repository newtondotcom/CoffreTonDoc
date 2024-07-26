<script setup lang="ts">
    const { signIn } = useAuth();
    const { locale, setLocale } = useI18n();
    const { t } = useI18n();
    import { useToast } from '@/components/ui/toast/use-toast';
    const { toast } = useToast();
    import errorCodes from '~/utils/codes';

    definePageMeta({
        layout: false,
        auth: {
            unauthenticatedOnly: true,
            navigateAuthenticatedTo: '/platform',
        },
    });

    const username = ref('testrandom2@gmail.com');
    const password = ref('test');
    const loading = ref(false);

    const value = ref<String[]>([]);
    const totpCode = ref(0);
    const handleComplete = (e: String[]) => {
        totpCode.value = e.join('');
        login();
    };

    const login = async () => {
        loading.value = true;
        if (username.value == '' || password.value == '' || totpCode.value == 0) {
            toast({
                title: t('error'),
                description: t('all_fields'),
                variant: 'destructive',
            });
            loading.value = false;
            return;
        }
        const response = await signIn('credentials', {
            redirect: false,
            username: username.value.trim(),
            password: password.value.trim(),
            totpCode: totpCode.value,
        });
        switch (response) {
            case errorCodes.incorrect_username || errorCodes.incorrect_password: {
                toast({
                    title: t('error'),
                    description: t('wrong_credentials'),
                    variant: 'destructive',
                });
                loading.value = false;
                break;
            }
            case errorCodes.incorrect_two_factor_code: {
                toast({
                    title: t('error'),
                    description: t('wrong_totp'),
                    variant: 'destructive',
                });
                loading.value = false;
                break;
            }
            default: {
                navigateTo('/platform');
                break;
            }
        }
    };
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
