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
        
        <ButtonLoading :loading text='t("submit")' execute="validateTotpCode"/>

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