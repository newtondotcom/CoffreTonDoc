<script setup>
const { signIn } = useAuth();
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
const password = ref("");

const form = ref(true);
const rules = ref({
  required: (value) => !!value || "Field is required",
});

const totpCode = 0;
const login = async (username, password) => {
  const response = await signIn("credentials", {
    redirect: false,
    username,
    password,
    totpCode,
  });

  if (response.error) {
    toast({
      title: "Error",
      description: "An error occured while log in",
      variant: "destructive",
    });
    return;
  }

  await navigateTo("/");
};
</script>

<template>
  <div class="d-flex align-center justify-center" style="height: 100vh">
    <div>
      <div
        title="Sign in"
        theme="customDark"
        v-bind="props"
        :elevation="isHovering ? 24 : 6"
        rounded="xl"
        width="400"
        class="mx-auto pa-10"
      >
        <form @submit.prevent="login(username, password)">
          <Input
            v-model="username"
            label="Username"
            :rules="[rules.required]"
          />

          <Input
            type="password"
            v-model="password"
            label="Password"
            :rules="[rules.required]"
          />

          <Input
            type="password"
            v-model="password"
            label="Code 2FA"
            :rules="[rules.required]"
          />

          <Button
            :disabled="!form"
            type="submit"
            color="primary"
            block
            class="mt-2"
            >Sign In</Button
          >
        </form>
        <Button color="primary" block class="mt-2" to="/auth/register" nuxt
          >Create new account</Button
        >
      </div>
    </div>
  </div>
</template>
