<template>
    <div class="flex-colitems-center flex justify-center align-middle">
        <div
            v-if="fetching"
            aria-label="Loading..."
            role="status"
            class="flex h-[40vh] w-[20vw] justify-center align-middle"
        >
            <svg class="h-6 w-6 animate-spin fill-slate-800" viewBox="3 3 18 18">
                <path
                    class="opacity-20"
                    d="M12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5ZM3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z"
                ></path>
                <path
                    d="M16.9497 7.05015C14.2161 4.31648 9.78392 4.31648 7.05025 7.05015C6.65973 7.44067 6.02656 7.44067 5.63604 7.05015C5.24551 6.65962 5.24551 6.02646 5.63604 5.63593C9.15076 2.12121 14.8492 2.12121 18.364 5.63593C18.7545 6.02646 18.7545 6.65962 18.364 7.05015C17.9734 7.44067 17.3403 7.44067 16.9497 7.05015Z"
                ></path>
            </svg>
        </div>
        <div v-else>
            <div class="grid gap-2">
                <img :src="dataUriQrCode" />
            </div>
            <div class="text-sm text-gray-500">{{ $t('topt_by_hand') }}{{ key }}</div>
            <div class="mb-4 flex flex-col items-center">
                <Label class="my-2 self-start" for="pin-input">{{ $t('twofa_code') }}</Label>
                <PinInput id="pin-input" v-model="pin" placeholder="○" @complete="handleComplete">
                    <PinInputGroup class="flex justify-center">
                        <PinInputInput v-for="(id, index) in 6" :key="id" :index="index" />
                    </PinInputGroup>
                </PinInput>
            </div>

            <ButtonLoading :loading :text="t('submit')" :execute="validateTotpCode" />
        </div>
    </div>
</template>

<script setup lang="ts">
    const props = defineProps({
        setSeedTurn: {
            type: Function,
            required: true,
        },
        Email: {
            type: Function,
            required: true,
        },
        Password: {
            type: Function,
            required: true,
        },
    });
    import { useToast } from '@/components/ui/toast/use-toast';
    const { toast } = useToast();
    const { t } = useI18n();

    import errorCodes from '~/utils/codes';
    const { signIn } = useAuth();

    const fetching = ref(true);
    const loading = ref(false);
    const dataUriQrCode = ref('');
    const key = ref('');
    const pin = ref<String[]>([]);
    const totpCode = ref(0);
    const handleComplete = (e: String[]) => {
        totpCode.value = e.join('');
        validateTotpCode();
    };

    const handleSetupToptp = async () => {
        fetching.value = true;
        const response = await $fetch(`/api/auth/totp/setup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                password: props.Password(),
                email: props.Email(),
            }),
        });
        if (response.dataUri) {
            dataUriQrCode.value = response.dataUri;
            key.value = response.key;
        } else if (response.message === errorCodes.two_factor_already_enabled) {
            props.setSeedTurn(true);
        } else {
            toast({
                title: t('error'),
                description: t('wrong_credentials'),
                variant: 'destructive',
            });
        }
        fetching.value = false;
    };

    const validateTotpCode = async () => {
        loading.value = true;
        const body = await $fetch(`/api/auth/totp/enable`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                totpCode: totpCode.value,
                email: props.Email(),
            }),
        });
        if (body.message === errorCodes.success) {
            toast({
                title: t('success'),
                description: t('twofa_enabled'),
            });
            const response = await signIn('credentials', {
                redirect: false,
                username: props.Email(),
                password: props.Password(),
                totpCode: totpCode.value,
            });
            props.setSeedTurn(true);
        } else if (body.message === errorCodes.incorrect_password) {
            toast({
                title: t('error'),
                description: t('wrong_credentials'),
                variant: 'destructive',
            });
            loading.value = false;
        } else {
            toast({
                title: t('error'),
                description: t('wrong_credentials'),
                variant: 'destructive',
            });
            loading.value = false;
        }
    };

    onMounted(async () => {
        await handleSetupToptp();
    });
</script>
