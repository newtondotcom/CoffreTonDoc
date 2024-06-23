<script setup lang="ts">
const supabase = useSupabaseClient();

const verifyCode = ref("");
const error = ref("");
const loading = ref(false);

async function onSubmitClicked() {
  loading.value = true;
  error.value = "";
  try {
    const { data: factors, error: factorsError } =
      await supabase.auth.mfa.listFactors();
    if (factorsError) {
      throw factorsError;
    }

    const totpFactor = factors.totp[0];

    if (!totpFactor) {
      throw new Error("No TOTP factors found!");
    }

    const factorId = totpFactor.id;

    const { data: challenge, error: challengeError } =
      await supabase.auth.mfa.challenge({ factorId });
    if (challengeError) {
      error.value = challengeError.message;
      throw challengeError;
    }

    const challengeId = challenge.id;

    const { data: verify, error: verifyError } = await supabase.auth.mfa.verify(
      {
        factorId,
        challengeId,
        code: verifyCode.value,
      },
    );
    if (verifyError) {
      error.value = verifyError.message;
      throw verifyError;
    }
    navigateTo("/platform");
  } catch (err) {
    console.error(err);
  }
  loading.value = false;
}
</script>

<template>
  <div>
    <div></div>
  </div>

  <Card>
    <CardHeader @keyup.enter="onSubmitClicked">
      <CardTitle>{{ $t("mfa_code") }}</CardTitle>
      <CardDescription>{{ $t("enter_mfa_code") }}</CardDescription>
    </CardHeader>
    <CardContent class="w-[100%] flex flex-col justify-center align-middle">
      <div v-if="error" class="error">{{ error }}</div>
      <Input type="text" v-model="verifyCode" />
    </CardContent>
    <CardFooter class="justify-end">
      <Button type="button" @click="onSubmitClicked">
        <div v-if="loading" class="ml-1 flex">
          <svg
            class="animate-spin h-4 w-4 m-1"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            ></path>
          </svg>
        </div>
        <div v-else>
          {{ $t("submit") }}
        </div>
      </Button>
    </CardFooter>
  </Card>
</template>
