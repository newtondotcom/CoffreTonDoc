<script setup lang="ts">
const { signIn } = useAuth();
const { locale, setLocale } = useI18n()
const { t } = useI18n()
import { useToast } from "@/components/ui/toast/use-toast";
import errorCodes from "~/utils/codes";
const { toast } = useToast();

definePageMeta({
  layout: false,
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: "/platform",
  },
});

const username = ref("");
const password = ref("");
const loading = ref(false);

const value = ref<String[]>([]);
const totpCode = ref(0);
const handleComplete = (e: String[]) => {
  totpCode.value = e.join("");
  login();
};

const login = async () => {
  loading.value = true;
  if (username.value == "" || password.value == "" || totpCode.value == 0) {
    toast({
      title: t("error"),
      description: t("all_fields"),
      variant: "destructive",
    });
    loading.value = false;
    return;
  }
  const response = await signIn("credentials", {
    redirect: false,
    username: username.value.trim(),
    password: password.value.trim(),
    totpCode: totpCode.value,
  });
  if (
    response == errorCodes.incorrect_username ||
    response == errorCodes.incorrect_password
  ) {
    toast({
      title: t("error"),
      description: t("wrong_credentials"),
      variant: "destructive",
    });
  loading.value = false;
    return;
  }
  if (response == errorCodes.incorrect_two_factor_code) {
    toast({
      title: t("error"),
      description: t("wrong_totp"),
      variant: "destructive",
    });
  loading.value = false;
    return;
  }
  navigateTo("/platform");
};
</script>

<template>
  <div class="flex items-center justify-center h-screen">
    <Card class="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle class="text-2xl"> {{ $t("connect_us") }} </CardTitle>
        <CardDescription>
          {{ $t("login_description") }}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="grid gap-4">
          <div class="grid gap-2">
            <Label for="email">{{ $t("email") }}</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              v-model="username"
            />
          </div>
          <div class="grid gap-2">
            <div class="flex items-center">
              <Label for="password">{{ $t("password") }}</Label>
              <NuxtLink
                to="/auth/reset"
                class="ml-auto inline-block text-sm underline"
              >
                Forgot your password?
              </NuxtLink>
            </div>
            <Input id="password" type="password" required v-model="password" />
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
          
          <ButtonLoading :loading text='t("login")' execute="login"/>
          
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
          {{ $t("no_account") }}
          <NuxtLink to="/auth/register" class="underline">
            {{ $t("register") }}
          </NuxtLink>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
