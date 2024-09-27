<template>
    <div class="my-4 flex flex-col items-center justify-center gap-4 px-2">
        <div class="flex flex-row items-center">
            <div
                class="mr-2 h-3 w-3 rounded-full bg-green-500"
                v-if="status === 'authenticated'"
            ></div>
            <span v-if="!isCollapsed && status === 'authenticated'">{{ $t('authenticated') }}</span>
            <div
                class="mr-2 h-3 w-3 rounded-full bg-red-500"
                v-if="status !== 'authenticated'"
            ></div>
            <span v-if="!isCollapsed && status !== 'authenticated'">
                {{ $t('unauthenticated') }}
            </span>
        </div>
        <div class="flex flex-row items-center justify-center gap-4" v-if="!isCollapsed">
            <div class="grid gap-1">
                <p class="text-sm text-muted-foreground">{{ $t('logged_in') }}</p>
                <p class="truncate text-sm font-medium leading-none">{{ auth }}</p>
            </div>
        </div>
        <Button variant="destructive" @click="logout">
            <LogOut v-if="isCollapsed" />
            <span v-if="!isCollapsed">Log out</span>
        </Button>
    </div>
</template>

<script setup lang="ts">
    import { useToast } from '@/components/ui/toast/use-toast';
    const { toast } = useToast();
    import { useI18n } from '#imports';
    import { setHashAddValue } from '~/utils/cookie';
    import { LogOut } from 'lucide-vue-next';
    const { t } = useI18n();

    interface HiProps {
        isCollapsed: boolean;
    }
    const props = defineProps<HiProps>();

    let status = ref('unauthenticated');

    const auth = ref(getAddValue());

    if (auth) {
        status.value = 'authenticated';
    }

    async function logout() {
        await $fetch('/api/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        }).catch((e) => {
            toast({
                title: t('error'),
                description: t('logout_error'),
                variant: 'destructive',
            });
            return;
        });
        setAddValue('');
        status.value = 'unauthenticated';
        setAddValue('');
        setHashAddValue('');
        toast({
            title: t('success'),
            description: t('logout_success'),
        });
        navigateTo('/');
    }

    async function doubtAuth() {
        const res = await $fetch(`/api/auth/personal_information`, {
            credentials: 'include',
        });
        console.log(res);
    }
</script>
