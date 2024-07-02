<template>
  <div class="gap-4 mt-4 mb-4 flex flex-col justify-center items-center">
    <div class="flex flex-row justify-center items-center gap-4">
      <Avatar class="hidden h-9 w-9 sm:flex">
        <AvatarImage src="/avatars/01.png" alt="Avatar" />
        <AvatarFallback>{{ initials }}</AvatarFallback>
      </Avatar>
      <div class="grid gap-1">
        <p class="text-sm font-medium leading-none">Olivia Martin</p>
        <p class="text-sm text-muted-foreground">
          {{ email }}
        </p>
      </div>
      <!-- 
              <div class="ml-auto font-medium">
                +$1,999.00
              </div>
                -->
    </div>
    <Button class="w-[70%]" variant="destructive"> Log out </Button>
  </div>
</template>

<script setup lang="ts">
import { assert } from "@vueuse/core";
const { data} = useAuth();
const name = ref(data.name);
const email = ref(data.email);

const initials_cookie = useCookie("initials");
if (!initials_cookie.value) {
  initials_cookie.value = "NI";
} else {
  assert(
    name.value.includes(initials_cookie.value[1]) &&
      name.value.includes(initials_cookie.value[0]),
    "Initials in cookie do not match user name",
  );
}
const initials = ref(initials_cookie.value);
</script>
