<script setup lang="ts">
const props = defineProps({
  onEnrolled: {
    type: Function,
    required: true,
  },
  onCancelled: {
    type: Function,
    required: true,
  },
});

const supabase = useSupabaseClient();

const factorId = ref("");
const qr = ref("");
const verifyCode = ref("");
const error = ref("");

async function onEnableClicked() {
  error.value = "";
  try {
    const { data, error } = await supabase.auth.mfa.challenge({
      factorId: factorId.value,
    });
    if (error) {
      error.value = error.message;
      throw error;
    }

    const challengeId = data.id;

    const { data: verifyData, error: verifyError } =
      await supabase.auth.mfa.verify({
        factorId: factorId.value,
        challengeId,
        code: verifyCode.value,
      });
    if (verifyError) {
      error.value = verifyError.message;
      throw verifyError;
    }

    props.onEnrolled();
  } catch (err) {
    console.error(err);
  }
}

onMounted(async () => {
  try {
    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: "totp",
    });
    if (error) {
      throw error;
    }

    factorId.value = data.id;
    qr.value = data.totp.qr_code;
  } catch (err) {
    console.error(err);
  }
});
</script>

<template>
  <div>
    <div v-if="error" class="error">{{ error }}</div>
    <img class="" :src="qr" />
    <Input type="text" v-model="verifyCode" />
    <Input type="button" value="Enable" @click="onEnableClicked" />
    <Input type="button" value="Cancel" @click="props.onCancelled" />
  </div>
</template>
