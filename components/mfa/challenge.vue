<script setup lang="ts">
const supabase = useSupabaseClient();

const verifyCode = ref("");
const error = ref("");

async function onSubmitClicked() {
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
}
</script>

<template>
  <div>
    <div> {{$t('enter_mfa_code')}}</div>
    <div v-if="error" class="error">{{ error }}</div>
    <div class="w-[50%]">
      <Input type="text" v-model="verifyCode" />
      <Button type="button" @click="onSubmitClicked">{{$t('sumbit')}}</Button>
    </div>
  </div>
</template>
