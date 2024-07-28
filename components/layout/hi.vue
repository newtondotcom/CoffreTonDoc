<template>
    <div class="mb-4 mt-4 flex flex-col items-center justify-center gap-4">
        <div class="flex flex-row items-center justify-center gap-4">
            <Avatar class="hidden h-9 w-9 sm:flex">
                <AvatarImage src="/avatars/01.png" alt="Avatar" />
            </Avatar>
            <div class="grid gap-1">
                <p class="truncate text-sm font-medium leading-none">{{ auth }}</p>
                <p class="text-sm text-muted-foreground">EMAIL</p>
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

    function logout() {
        cookie.value = undefined;
        status.value = 'unauthenticated';
    }
</script>
