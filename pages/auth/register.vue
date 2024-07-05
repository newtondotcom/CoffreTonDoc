<script setup lang="ts">
definePageMeta({
  layout: false,
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: "/platform",
  },
});

const twoFATurn = ref(false);
const seedTurn = ref(false);

const set2FATurn = (value : Boolean) => {
  twoFATurn.value = value;
}

const setSeedTurn = (value : Boolean) => {
  if (value){
    twoFATurn.value = false;
  }
  twoFATurn.value = value;
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
       />
      <AuthRegisterGenerateTotp
      v-else
      :setSeedTurn
       />
      <AuthRegisterSeed 
      v-if="seedTurn"
      />
    </CardContent>
    </Card>
  </div>
</template>
