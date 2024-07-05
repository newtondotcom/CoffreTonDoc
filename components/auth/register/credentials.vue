<template>

        <div class="grid gap-4">
          <div class="grid gap-2">
            <Label for="username">{{ $t("username") }}</Label>
            <Input
              id="username"
              type="text"
              placeholder="Robebs Boomer"
              required
              v-model="username"
            />
          </div>
          <div class="grid gap-2">
            <Label for="email">{{ $t("email") }}</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              v-model="email"
            />
          </div>
          <div class="grid gap-2">
            <Label for="password">{{ $t("password") }}</Label>
            <Input id="password" type="password" required v-model="password" />
          </div>
          <div class="grid gap-2">
            <Label for="password">{{ $t("password_confirmation") }}</Label>
            <Input
              id="password"
              type="password"
              required
              v-model="password_confirmation"
            />
          </div>
          <Button type="submit" class="w-full" @click="register">
            <div
              v-if="loading"
              aria-label="Loading..."
              role="status"
              class="align-middle justify-center flex"
            >
              <svg
                class="animate-spin w-6 h-6 fill-slate-800"
                viewBox="3 3 18 18"
              >
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
              {{ $t("register") }}
            </div>
          </Button>
        </div>
        <div class="mt-4 text-center text-sm">
          {{ $t("allow_using") }}
          <NuxtLink class="text-gray-500 underline" to="/tos">{{
            $t("tos")
          }}</NuxtLink>
          and
          <NuxtLink to="/privacy" class="text-gray-500 underline">{{
            $t("privacy")
          }}</NuxtLink>
          <br />

          <span class="text-xs">
            {{ $t("data_collect") }}
          </span>
        </div>
        <div class="mt-4 text-center text-sm">
          {{ $t("already_account") }}
          <NuxtLink to="/auth/login" class="underline">
            {{ $t("login") }}
          </NuxtLink>
        </div>

</template>

<script setup lang="ts">
const props = defineProps({
  set2FATurn: {
    type: Function,
    required: true
  }
})

import { useToast } from "@/components/ui/toast/use-toast";
const { toast } = useToast();
import errorCodes from "~/utils/codes";
const { t } = useI18n()
const loading = ref(false);

const username = ref("Roebbs  Boomer");
const email = ref("test@gmail.com");
const password = ref("test");
const password_confirmation = ref("test");

const register = async () => {
  loading.value = true;
  if (
    username.value == "" ||
    password.value == "" ||
    password_confirmation.value == 0 ||
    password.value != password_confirmation.value
  ) {
    toast({
      title: t("error"),
      description: t("all_fields"),
      variant: "destructive",
    });
    return;
  }
  const data = await $fetch(`/api/auth/register`, {
    method: "POST",
    body: {
      email: email.value,
      password: password.value,
      name: username.value,
    },
  });
  loading.value = true;
  if (data.message == errorCodes.user_already_exists) {
    toast({
      title: t("error"),
      description: t("missing_2fa_account"),
      variant: "destructive",
    });
    props.set2FATurn(true);
    return;
  }
  if (data.message == errorCodes.success_user_created) {
    toast({
      title: t("success"),
      description: t("account_created"),
    });
    props.set2FATurn(true);
    return;
  }
  else {
    toast({
      title: t("error"),
      description: t("wrong_credentials"),
      variant: "destructive",
    });
    return;
  }
};


</script>