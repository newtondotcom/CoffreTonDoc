<script setup lang="ts">
const supabase = useSupabaseClient()

onMounted(async () => {
  try {
    const { data, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
    if (error) {
      throw error
    }

    console.log(data)

    if (data.nextLevel === 'aal2' && data.nextLevel !== data.currentLevel) {
      <MfaEnrollment />
    } else {
      navigateTo("/platform")
    }
  } finally {
    readyToShow.value = true
  }
})
</script>

<template>
    <MfaAuth />
</template>
