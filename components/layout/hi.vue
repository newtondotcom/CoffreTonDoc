<template>
<div class="gap-4 mt-4 mb-4 flex flex-col justify-center items-center">
    <div class="flex flex-row justify-center items-center gap-4">
        <Avatar class="hidden h-9 w-9 sm:flex">
            <AvatarImage src="/avatars/01.png" alt="Avatar" />
            <AvatarFallback>{{initials}}</AvatarFallback>
        </Avatar>
        <div class="grid gap-1">
            <p class="text-sm font-medium leading-none">
                Olivia Martin
            </p>
            <p class="text-sm text-muted-foreground">
                {{email}}
            </p>
        </div>
        <!-- 
              <div class="ml-auto font-medium">
                +$1,999.00
              </div>
                -->
    </div>
    <Button class="w-[70%]" variant="destructive">
        Log out
    </Button>
</div>
</template>

<script setup lang="ts">

const email_cookie = useCookie('email');
if (!email_cookie.value) {
    email_cookie.value = 'asphalt9fr@gmail.com';
}
const email = ref(email_cookie.value);

const name_cookie = useCookie('name');
if (!name_cookie.value) {
    name_cookie.value = 'Newton IsOp';
}
const name = ref(name_cookie.value);

const initials_cookie = useCookie('initials');
if (!initials_cookie.value) {
    initials_cookie.value = 'NI';
}
const initials = ref(initials_cookie.value);

</script>
