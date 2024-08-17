<template>
    <div class="my-4 flex flex-col items-center justify-center gap-4 px-4">
        <div class="flex flex-row items-center justify-center gap-4">
            <div class="grid gap-1">
                <p class="text-sm text-muted-foreground">{{ $t('logged_in') }}</p>
                <p class="truncate text-sm font-medium leading-none">{{ auth }}</p>
            </div>
        </div>
        <div v-if="status === 'authenticated'" class="flex flex-row items-center">
            <div class="mr-2 h-3 w-3 rounded-full bg-green-500"></div>
            {{ $t('authenticated') }}
        </div>
        <div v-else class="flex flex-row items-center">
            <div class="mr-2 h-3 w-3 rounded-full bg-red-500"></div>
            {{ $t('unauthenticated') }}
        </div>
        <Button class="w-[70%]" variant="destructive" @click="logout">Log out</Button>
    </div>
</template>

<script setup lang="ts">
    import { useToast } from '@/components/ui/toast/use-toast';
    const { toast } = useToast();
    import { useI18n } from '#imports';
    import { setHashAddValue } from '~/utils/cookie';
    const { t } = useI18n();

    let status = ref('unauthenticated');

    const auth = useCookie('add', {
        path: '/',
        secure: true, // Only send cookie over HTTPS
        httpOnly: false, // Allow JavaScript access to cookie
        sameSite: 'strict', // Prevent CSRF attacks
        signed: true, // Sign cookie to verify integrity
        watch: true,
    });

    if (auth.value) {
        status.value = 'authenticated';
    }

    async function logout() {
        const data = await $fetch('/api/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });
        if (data.status === 200) {
            auth.value = undefined;
            status.value = 'unauthenticated';
            setAddValue('');
            setHashAddValue('');
            toast({
                title: t('success'),
                description: t('logout_success'),
            });
        } else {
            toast({
                title: t('error'),
                description: t('logout_error'),
                variant: 'destructive',
            });
        }
    }
</script>
