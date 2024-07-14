<template>
    <div class="grid gap-4">
        <div class="grid gap-2">
            <Label class="my-2" for="username">{{ $t('username') }}</Label>
            <Input
                id="username"
                type="text"
                placeholder="Robebs Boomer"
                required
                v-model="username"
            />
        </div>
        <div class="grid gap-2">
            <Label class="my-2" for="email">{{ $t('email') }}</Label>
            <Input id="email" type="email" placeholder="m@example.com" required @input="Email" />
        </div>
        <div class="grid gap-2">
            <Label class="my-2" for="password">{{ $t('password') }}</Label>
            <Input
                id="password"
                type="password"
                required
                @input="Password"
                placeholder="password"
            />
        </div>
        <div class="grid gap-2">
            <Label class="my-2" for="password">{{ $t('password_confirmation') }}</Label>
            <Input
                id="password"
                type="password"
                required
                placeholder="password"
                v-model="password_confirmation"
            />
        </div>

        <ButtonLoading :loading :text="$t('register')" :execute="register" />
    </div>
    <div class="mt-4 text-center text-sm">
        {{ $t('allow_using') }}
        <NuxtLink class="text-gray-500 underline" to="/tos">{{ $t('tos') }}</NuxtLink>
        and
        <NuxtLink to="/privacy" class="text-gray-500 underline">{{ $t('privacy') }}</NuxtLink>
        <br />

        <span class="mt-2 text-xs">
            {{ $t('data_collect') }}
        </span>
    </div>
    <div class="mt-4 text-center text-sm">
        {{ $t('already_account') }}
        <NuxtLink to="/auth/login" class="underline">
            {{ $t('login') }}
        </NuxtLink>
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    set2FATurn: {
        type: Function,
        required: true,
    },
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
import errorCodes from '~/utils/codes';
const { t } = useI18n();
const loading = ref(false);

const username = ref('');
const password_confirmation = ref('');

const register = async () => {
    loading.value = true;
    if (
        username.value == '' ||
        props.Email() == '' ||
        props.Password() == '' ||
        password_confirmation.value == '' ||
        props.Password() != password_confirmation.value
    ) {
        toast({
            title: t('error'),
            description: t('all_fields'),
            variant: 'destructive',
        });
        loading.value = false;
        return;
    }
    const data = await $fetch(`/api/auth/register`, {
        method: 'POST',
        body: {
            email: props.Email(),
            password: props.Password(),
            name: username.value,
        },
    });
    loading.value = true;
    switch (data.message) {
        case errorCodes.user_already_exists: {
            toast({
                title: t('error'),
                description: t('missing_2fa_account'),
                variant: 'destructive',
            });
            props.set2FATurn(true);
            break;
        }
        case errorCodes.two_factor_already_enabled: {
            toast({
                title: t('error'),
                description: t('twofa_already_enabled'),
                variant: 'destructive',
            });
            props.setSeedTurn(true);
            break;
        }
        case errorCodes.seed_already_generated: {
            toast({
                title: t('error'),
                description: t('twofa_already_enabled'),
                variant: 'destructive',
            });
            navigateTo('/auth/login')
            break;
        }
        case errorCodes.success_user_created: {
            toast({
                title: t('success'),
                description: t('account_created'),
            });
            props.set2FATurn(true);
            break;
        }
        default: {
            toast({
                title: t('error'),
                description: t('wrong_credentials'),
                variant: 'destructive',
            });
            break;
        }
    }
    return;
};
</script>
