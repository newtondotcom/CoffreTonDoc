<template>

        <div class="grid gap-2">
          <img :src="dataUriQrCode" class="" alt="2FA code" />
        </div>
        <div class="grid gap-2">
          <Label for="email">{{ $t("twofa_code") }}</Label>
          <PinInput
            id="pin-input"
            v-model="value"
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
        <Button type="submit" class="w-full" @click="validateTotpCode">
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
            {{ $t("submit") }}
          </div>
        </Button>

</template>

<script setup lang="ts">
const props = defineProps({
setSeedTurn: {
    type: Function,
    required: true
  }
})

import {signIn} from "#auth";
import { useToast } from "@/components/ui/toast/use-toast";
import errorCodes from "~/utils/codes";
const { toast } = useToast();
const { t } = useI18n()
const loading = ref(false);
const value = ref<String[]>([]);
const totpCode = ref(0);
const handleComplete = (e: String[]) => {
  totpCode.value = e.join("");
  validateTotpCode();
};
const dataUriQrCode = ref("");

const username = ref("Roebbs  Boomer");
const email = ref("test@gmail.com");
const password = ref("test");
const password_confirmation = ref("test");

onMounted(async () => {
  await handleSetupToptp();
});

const handleSetupToptp = async () => {
  loading.value = true;

  try {
    const response = await $fetch(`/api/auth/totp/setup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password: password.value,
        email: email.value,
      })
    });
    if (response.dataUri) {
      dataUriQrCode.value = response.dataUri;
    } else if (response.message === errorCodes.two_factor_already_enabled) {
      props.setSeedTurn(true);
    } else {
      toast({
      title: t("error"),
      description: t("wrong_credentials"),
      variant: "destructive",
      });
    }
  } catch (e) {
    console.error(e);
    toast({
      title: t("error"),
      description: t("wrong_credentials"),
      variant: "destructive",
    });
  } finally {
    loading.value = false;
  }
};

const validateTotpCode = async () => {
  loading.value = true;

  try {
    const body = await $fetch(`/api/auth/totp/enable`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        totpCode: totpCode.value,
        email: email.value,
      }),
    });
    console.log(body);
    if (body.status === 200) {
      toast({
        title: t("success"),
        description: t("twofa_enabled")
      });  
      const response = await signIn("credentials", {
        redirect: false,
        username: username.value.trim(),
        password: password.value.trim(),
        totpCode: totpCode.value,
      });
      props.setSeedTurn(false);
    } else if (body.error === errorCodes.incorrect_password) {
      toast({
      title: t("error"),
      description: t("wrong_credentials"),
      variant: "destructive",
      });
    } else {
      toast({
      title: t("error"),
      description: t("wrong_credentials"),
      variant: "destructive",
      });
    }
  } catch (e) {
    console.error(e);
      toast({
      title: t("error"),
      description: t("wrong_credentials"),
      variant: "destructive",
      });
  } finally {
    loading.value = false;
  }
};

</script>