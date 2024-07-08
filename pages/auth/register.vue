<script setup lang="ts">
definePageMeta({
  layout: false,
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: '/platform',
  },
});

enum STATES {
  CREDENTIALS,
  TOTP,
  SEED,
}
const currentState = ref(STATES.CREDENTIALS);

const set2FATurn = (value: Boolean) => {
  if (value) {
    currentState.value = STATES.TOTP;
  } else {
    currentState.value = STATES.CREDENTIALS;
  }
};

const setSeedTurn = (value: Boolean) => {
  if (value) {
    currentState.value = STATES.SEED;
  } else {
    currentState.value = STATES.TOTP;
  }
};

const email = ref(`test${Math.random().toString()}@gmail.com`);
const password = ref('test');

const Email = (value: any) => {
  if (typeof value == 'object') email.value = value.target.value;
  else return email.value;
};
const Password = (value: any) => {
  if (typeof value == 'object') password.value = value.target.value;
  else return password.value;
};
</script>

<template>
  <div class="flex items-center justify-center h-screen">
    <Card class="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle class="text-2xl"> {{ $t('connect_us') }} </CardTitle>
        <CardDescription>
          {{ $t('register_description') }}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AuthRegisterCredentials
          v-if="currentState == STATES.CREDENTIALS"
          :set2FATurn
          :Password
          :Email
        />
        <AuthRegisterGenerateTotp
          v-if="currentState == STATES.TOTP"
          :setSeedTurn
          :Password
          :Email
        />
        <AuthRegisterSeed v-if="currentState == STATES.SEED" />
      </CardContent>
    </Card>
  </div>
</template>
