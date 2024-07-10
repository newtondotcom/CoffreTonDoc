<template>
    <div class="grid gap-2">
        <img :src="dataUriQrCode" class="" alt="2FA code" />
    </div>
    <div class="mb-4 grid gap-2">
        <Label class="my-2" for="email">{{ $t('twofa_code') }}</Label>
        <PinInput
            id="pin-input"
            v-model="pin"
            placeholder="○"
            @complete="handleComplete"
        >
            <PinInputGroup>
                <PinInputInput
                    v-for="(id, index) in 6"
                    :key="id"
                    :index="index"
                />
            </PinInputGroup>
        </PinInput>
    </div>

    <ButtonLoading :loading :text="t('submit')" :execute="validateTotpCode" />
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

const loading = ref(false);
const dataUriQrCode = ref('');
const pin = ref<String[]>([]);
const totpCode = ref(0);
const handleComplete = (e: String[]) => {
    totpCode.value = e.join('');
    validateTotpCode();
};

const handleSetupToptp = async () => {
    loading.value = true;
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
        if (response.code == 200 && response.dataUri){
            dataUriQrCode.value = response.dataUri;
        }
        if (response.message === errorCodes.two_factor_already_enabled) {
            props.setSeedTurn(true);
        } else {
            toast({
                title: t('error'),
                description: t('wrong_credentials'),
                variant: 'destructive',
            });
        }
    loading.value = false;
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
        console.log(body);
        if (body.statusCode === 200) {
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
        } else {
            toast({
                title: t('error'),
                description: t('wrong_credentials'),
                variant: 'destructive',
            });
        }
        loading.value = false;
};

onMounted(async () => {
    await handleSetupToptp();
});
</script>
