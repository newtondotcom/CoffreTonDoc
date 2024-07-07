<script setup lang="ts">
definePageMeta({
  layout: false,
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: "/platform",
  },
});

const STATES = "CRED" | "TOTP" | "SEED";
const currentState = ref("");

const set2FATurn = (value: Boolean) => {
  STATES 
};

const setSeedTurn = (value: Boolean) => {
  console.log(value);
  if (value) {
    twoFATurn.value = false;
  }
  seedTurn.value = value;
};


const email = ref(`test${Math.random().toString()}@gmail.com`);
const password = ref("test");

const setEmail = (value : any ) => {
  email.value = value.target.value;
}
const getEmail = () => {
  return email.value;
}
const setPassword = (value : any ) => {
  password.value = value.target.value;
}
const getPassword = () => {
  return password.value;
}
</script>

<template>
  <div class="flex items-center justify-center h-screen">
    <Card class="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle class="text-2xl"> {{ $t("connect_us") }} </CardTitle>
        <CardDescription>
          {{ $t("register_description") }}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AuthRegisterCredentials 
        v-if="!twoFATurn" 
        :set2FATurn 
        :setPassword
        :getPassword
        :setEmail 
        :getEmail
        />
        <AuthRegisterGenerateTotp v-else 
        :setSeedTurn
        :getPassword
        :getEmail/>
        <AuthRegisterSeed v-if="seedTurn" />
      </CardContent>
    </Card>
  </div>
</template>
