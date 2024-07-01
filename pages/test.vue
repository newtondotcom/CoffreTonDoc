<script setup lang="ts">

definePageMeta({
    layout : false,
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: '/',
  }
})
const { status, data, signIn, signOut, refresh   } = useAuth()

</script>


<template>

{{ status}}
{{ data}}

</template>