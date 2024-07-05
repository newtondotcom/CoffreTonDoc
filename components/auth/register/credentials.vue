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
          
          <ButtonLoading :loading text='t("register")' execute="register"/>
          
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