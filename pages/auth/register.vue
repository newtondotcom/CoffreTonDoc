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

const form = ref(true);
const rules = ref({
  required: (v) => !!v || "Field is required",
  email: (v) =>
    !v ||
    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
    "E-mail must be valid",
});

const register = async () => {
  const { data, error } = await useFetch(`/api/auth/register`, {
    method: "POST",
    body: {
      name: username.value,
      email: email.value,
      password: password.value,
    },
  });

  if (error.value) {
    toast({
      title: "Error",
      description: "An error occured while log in",
      variant: "destructive",
    });
    return;
  }
  toast({
    title: "Success",
    description: "Account created successfully",
  });
  await navigateTo("/auth/login");
};
</script>

<template>
  <div class="d-flex align-center justify-center" style="height: 100vh">
    <div
      title="Create new account"
      theme="customDark"
      v-bind="props"
      :elevation="isHovering ? 24 : 6"
      rounded="xl"
      width="400"
      class="mx-auto pa-10"
    >
      <form @submit.prevent="register">
        <Input
          v-model="username"
          label="Username"
          :rules="[rules.required]"
        ></Input>

        <Input
          type="email"
          v-model="email"
          label="Email"
          :rules="[rules.required, rules.email]"
        ></Input>

        <Input
          type="password"
          v-model="password"
          label="Password"
          :rules="[rules.required]"
        ></Input>

        <Button
          :disabled="!form"
          type="submit"
          color="primary"
          block
          class="mt-2"
          >Register</Button
        >
      </form>
      <Button color="primary" block class="mt-2" to="/auth/login" nuxt
        >Sign in</Button
      >
    </div>
  </div>
</template>
