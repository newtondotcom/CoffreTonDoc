<script setup lang="ts">
const { signIn } = useAuth();
import { useToast } from "@/components/ui/toast/use-toast";
import errorCodes from "~/utils/codes";
const { toast } = useToast();

definePageMeta({
  layout: false,
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: "/",
  },
});

const username = ref("");
const password = ref("");
const totpCode = ref(0);
const loading = ref(false);

const value = ref<String[]>([])
const handleComplete = (e: String[]) =>  {
  totpCode.value = e.join('');
  login();
}


const login = async () => {
  loading.value = true;
  if (username.value == "" || password.value == "" || totpCode.value == 0) {
    toast({
      title: $t("error"),
      description: $t("all_fields"),
      variant: "destructive",
    });
  loading.value = false;
    return;
  }
  const response = await signIn("credentials", {
    redirect: false,
    username : username.value.trim(),
    password : password.value.trim(),
    totpCode : totpCode.value,
  });
  loading.value = false;
  if (response == errorCodes.IncorrectUsernamePassword || response == errorCodes.IncorrectPassword) {
    toast({
      title: $t("error"),
      description: $t("wrong_credentials"),
      variant: "destructive",
    });
    return;
  }
  if (response == errorCodes.IncorrectTwoFactorCode) {
    toast({
    title: $t("error"),
      description: $t("wrong_totp"),
      variant: "destructive",
    });
    return;
  }
  await navigateTo("/");
};

</script>

<template>
  <div class="flex items-center justify-center h-screen">
    <Card class="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle class="text-2xl"> Connect with us </CardTitle>
        <CardDescription>
          Use one of the following methods to log in or register
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="grid gap-4">
                    <div class="grid gap-2">
                        <Label for="email">Email</Label>
                        <Input id="email" type="email" placeholder="m@example.com" required v-model="email" />
                    </div>
                    <div class="grid gap-2">
                        <div class="flex items-center">
                            <Label for="password">Password</Label>
                            <NuxtLink to="/auth/reset" class="ml-auto inline-block text-sm underline">
                                Forgot your password?
                            </NuxtLink>
                        </div>
                        <Input id="password" type="password" required v-model="password" />
                    </div>
                    <div class="grid gap-2">
                        <Label for="email">2FA Code</Label>    
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
                    <Button type="submit" class="w-full" @click="login">
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
                          {{$t("login")}}
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
                    {{$t("no_account")}}
                    <NuxtLink to="/auth/register" class="underline">
                        {{$t("register")}}
                    </NuxtLink>
                </div>
      </CardContent>
    </Card>
  </div>
</template>
