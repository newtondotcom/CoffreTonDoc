<template>
    <div class="mb-4 mt-4 flex flex-col items-center justify-center gap-4">
        <div class="flex flex-row items-center justify-center gap-4">
            <Avatar class="hidden h-9 w-9 sm:flex">
                <AvatarImage src="/avatars/01.png" alt="Avatar" />
            </Avatar>
            <div class="grid gap-1">
                <p class="text-sm font-medium leading-none">Olivia Martin</p>
                <p class="text-sm text-muted-foreground">EMAIL</p>
            </div>
            <!-- 
              <div class="ml-auto font-medium">
                +$1,999.00
              </div>
                -->
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

    // TODO : check if the user is authenticated
    if (true) {
        status.value = 'authenticated';
    }

    function logout() {
        cookie.value = undefined;
        status.value = 'unauthenticated';
    }
</script>
