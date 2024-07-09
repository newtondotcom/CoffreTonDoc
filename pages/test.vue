<script setup lang="ts">
definePageMeta({
    layout: false,
    auth: {
        unauthenticatedOnly: true,
        navigateAuthenticatedTo: '/',
    },
});
const {
    status,
    data,
    lastRefreshedAt,
    getCsrfToken,
    getProviders,
    getSession,
    signIn,
    signOut,
} = useAuth();

enum UploadState {
    STEP1 = 'STEP1',
    STEP2 = 'STEP2',
    STEP3 = 'STEP3',
    COMPLETE = 'STEP4',
}

const loading = ref(true);
const currentStep = ref(UploadState.STEP1);

const uploadSteps = async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate step 1
    currentStep.value = UploadState.STEP2;

    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate step 2
    currentStep.value = UploadState.STEP3;

    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate step 3
    currentStep.value = UploadState.COMPLETE;
    console.log(currentStep.value);

    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate completion
    loading.value = false;
};

onMounted(uploadSteps);
</script>

<template>
    {{ status }}
    {{ data }}
    {{ lastRefreshedAt }}

    <LayoutLoadingFullScreen :loading :currentStep />
</template>
