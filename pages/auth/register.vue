<script setup lang="ts">
import { useToast } from "@/components/ui/toast/use-toast";
const { toast } = useToast();

definePageMeta({
  layout: false,
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: "/",
  },
});

const username = ref("");
const email = ref("");
const password = ref("");
const password_confirmation = ref("");

const value = ref<String[]>([]);
const totpCode = ref(0);
const handleComplete = (e: String[]) =>  {
  totpCode.value = e.join('');
  handleSetupToptp();
}
const twoFATurn = ref(false);
const loading = ref(false);
const dataUriQrCode = ref("");

const register = async () => {
  loading.value = true;  
  if (username.value == "" || password.value == "" || password_confirmation.value == 0 || password.value != password_confirmation.value) {
    toast({
      title: $t("error"),
      description: $t("all_fields"),
      variant: "destructive",
    });
    return;
  }
  const { data, error } = await $fetch(`/api/auth/register`, {
    method: "POST",
    body: {
      email: email.value,
      password: password.value,
      name : username.value
    },
  });
  loading.value = true;
  if (error.value) {
    toast({
      title: $t("error"),
      description: $t("wrong_credentials"),
      variant: "destructive",
    });
    return;
  }
  toast({
    title: $t("success"),
    description: $t("account_created"),
  });
  twoFATurn.value = true;
  await navigateTo("/auth/login");
};

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
      }),
    });
    const body = await response.json();

    if (response.status === 200) {
      dataUriQrCode.value = body.dataUri;
    } else if (body.error === errorCodes.incorrect_password) {
      toast({
        title: "Incorrect Password",
        status: "error",
      });
    } else {
      toast({
        title: "Sorry something went wrong",
        status: "error",
      });
    }
  } catch (e) {
    toast({
      title: "Sorry something went wrong",
      status: "error",
    });
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="flex items-center justify-center h-screen">
    <Card class="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle class="text-2xl"> {{$t("connect_us")}} </CardTitle>
        <CardDescription>
          {{$t("register_description")}}
        </CardDescription>
      </CardHeader>
      <CardContent v-if="!twoFATurn">
        <div class="grid gap-4">
                    <div class="grid gap-2">
                        <Label for="email">{{$t("email")}}</Label>
                        <Input id="email" type="email" placeholder="m@example.com" required v-model="email" />
                    </div>
                    <div class="grid gap-2">
                        <Label for="password">{{$t("password")}}</Label>
                        <Input id="password" type="password" required v-model="password" />
                    </div>
                    <div class="grid gap-2">
                        <Label for="password">{{$t("password_confirmation")}}</Label>
                        <Input id="password" type="password" required v-model="password_confirmation" />
                    </div>
                    <Button type="submit" class="w-full" @click="register">
                        <div v-if="loading" aria-label="Loading..." role="status"
                            class="align-middle justify-center flex">
                            <svg class="animate-spin w-6 h-6 fill-slate-800" viewBox="3 3 18 18">
                                <path class="opacity-20"
                                    d="M12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5ZM3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z">
                                </path>
                                <path
                                    d="M16.9497 7.05015C14.2161 4.31648 9.78392 4.31648 7.05025 7.05015C6.65973 7.44067 6.02656 7.44067 5.63604 7.05015C5.24551 6.65962 5.24551 6.02646 5.63604 5.63593C9.15076 2.12121 14.8492 2.12121 18.364 5.63593C18.7545 6.02646 18.7545 6.65962 18.364 7.05015C17.9734 7.44067 17.3403 7.44067 16.9497 7.05015Z">
                                </path>
                            </svg>
                        </div>
                        <div v-else>
                          {{$t("register")}}
                        </div>
                    </Button>
        </div>
        <div class="mt-4 text-center text-sm">
          {{$t("allow_using")}}
          <NuxtLink class="text-gray-500 underline" to="/tos"
            >{{$t("tos")}}</NuxtLink
          >
          and
          <NuxtLink
            to="/privacy"
            class="text-gray-500 underline"
            >{{$t("privacy")}}</NuxtLink
          >
          <br />

          <span class="text-xs">
            {{ $t("data_collect") }}
          </span>
        </div>
                <div class="mt-4 text-center text-sm">
                    {{$t("already_account")}}
                    <NuxtLink to="/auth/login" class="underline">
                        {{$t("login")}}
                    </NuxtLink>
                </div>
      </CardContent>
      
    <CardContent v-else>
      <div class="grid gap-2">
        <img :src="dataUriQrCode" class="" alt="2FA code" />

      </div>
      <div class="grid gap-2">
                        <Label for="email">{{$t("twofa_code")}}</Label>    
                        <PinInput
                          id="pin-input"
                          v-model="value"
                          placeholder="○"
                          @complete="handleComplete"
                        >
                          <PinInputGroup>
                            <PinInputInput
                              v-for="(id, index) in 5"
                              :key="id"
                              :index="index"
                            />
                          </PinInputGroup>
                        </PinInput>
                    </div>
                    <Button type="submit" class="w-full" @click="handleSetupToptp">

                    <div v-if="loading" aria-label="Loading..." role="status"
                            class="align-middle justify-center flex">
                            <svg class="animate-spin w-6 h-6 fill-slate-800" viewBox="3 3 18 18">
                                <path class="opacity-20"
                                    d="M12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5ZM3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z">
                                </path>
                                <path
                                    d="M16.9497 7.05015C14.2161 4.31648 9.78392 4.31648 7.05025 7.05015C6.65973 7.44067 6.02656 7.44067 5.63604 7.05015C5.24551 6.65962 5.24551 6.02646 5.63604 5.63593C9.15076 2.12121 14.8492 2.12121 18.364 5.63593C18.7545 6.02646 18.7545 6.65962 18.364 7.05015C17.9734 7.44067 17.3403 7.44067 16.9497 7.05015Z">
                                </path>
                            </svg>
                        </div>
                        <div v-else>
                            {{ $t("submit") }}
                          </div>
                        </Button>
      </CardContent>
    </Card>
  </div>

</template>
