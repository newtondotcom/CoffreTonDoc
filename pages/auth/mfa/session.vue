<script setup lang="ts">
const supabase = useSupabaseClient();
const authMFA = ref(false);
const enrolled = ref(false);
const loading = ref(true);

onMounted(async () => {
  try {
    const { data, error } =
      await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    console.log(data.nextLevel);
    console.log(data.currentLevel);
    if (!(data.nextLevel === "aal2" && data.nextLevel !== data.currentLevel)) {
      const { data, error } = await supabase.auth.mfa.listFactors();
      if (error) {
        throw error;
      } else {
        enrolled.value = true;
      }
    }
    //authMFA.value = true;
    //navigateTo("/platform");
    loading.value = false;
  } catch (error) {
    console.error("Error fetching data:", error.message);
  }
});
</script>

<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-secondary bg-opacity-50 backdrop-blur-sm px-4"
  >
    <div v-if="loading">
      <div class="ml-1 flex">
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
    </div>
    <div v-else>
      <MfaChallenge v-if="enrolled && !authMFA" />
      <MfaEnrollment v-else />
    </div>
  </div>
</template>
