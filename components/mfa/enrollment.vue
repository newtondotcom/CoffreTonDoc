<script setup lang="ts">
import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';
const randomName = uniqueNamesGenerator({ dictionaries: [animals] });

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

    navigateTo("/platform");
  } catch (err) {
    console.error(err);
  }
}

async function cancel() {
  navigateTo("/");
}

onMounted(async () => {
  try {
    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: "totp",
      friendlyName: randomName
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

<!-- MAKE COOL ERRORS LOGS + LOADING + CENTER VERTICALLY AND HORIZONTALLY -->
    <Card>
    <CardHeader>
      <CardTitle>{{$t('mfa_enrollment')}}</CardTitle>
      <CardDescription>{{$t('mfa_enrollment_description')}}</CardDescription>
    </CardHeader>
    <CardContent>
    <div v-if="error" class="error">{{ error }}</div>
    <img class="" :src="qr" />
    <Input type="text" placeholder="Please enter the code" v-model="verifyCode" />
    </CardContent>
    <CardFooter>
    <Button @click="onEnableClicked">{{$t('submit')}}</Button>
    <Button @click="cancel">{{$t('cancel')}}</Button>
    </CardFooter>
  </Card>
</template>
