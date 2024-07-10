<template>
    <div
        v-if="loading"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
    >
        <div class="space-y-6 p-6">
            <div
                class="flex w-[200px] flex-row items-center justify-center px-2 py-1 text-center"
                :class="{ [classCompleted]: currentStep === UploadState.STEP1 }"
            >
                <div :class="{ 'text-primary': currentStep > UploadState.STEP1 }" class="w-[160px]">
                    Compression du fichier
                </div>
                <div
                    class="flex h-[40px] w-[40px] flex-row items-center justify-center px-2 py-1 text-center"
                >
                    <div
                        v-if="currentStep === UploadState.STEP1"
                        aria-label="Loading..."
                        role="status"
                        class="mr-2 flex justify-center align-middle"
                    >
                        <svg class="h-6 w-6 animate-spin fill-primary" viewBox="3 3 18 18">
                            <path
                                class="opacity-20"
                                d="M12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5ZM3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z"
                            ></path>
                            <path
                                d="M16.9497 7.05015C14.2161 4.31648 9.78392 4.31648 7.05025 7.05015C6.65973 7.44067 6.02656 7.44067 5.63604 7.05015C5.24551 6.65962 5.24551 6.02646 5.63604 5.63593C9.15076 2.12121 14.8492 2.12121 18.364 5.63593C18.7545 6.02646 18.7545 6.65962 18.364 7.05015C17.9734 7.44067 17.3403 7.44067 16.9497 7.05015Z"
                            ></path>
                        </svg>
                    </div>
                    <BadgeCheck size="25" color="#23C15D" v-if="currentStep > UploadState.STEP1" />
                </div>
            </div>

            <div
                class="flex w-[200px] flex-row items-center justify-center px-2 py-1 text-center"
                :class="{ [classCompleted]: currentStep === UploadState.STEP2 }"
            >
                <div :class="{ 'text-primary': currentStep > UploadState.STEP2 }" class="w-[160px]">
                    Encryption du fichier
                </div>
                <div
                    class="flex h-[40px] w-[40px] flex-row items-center justify-center px-2 py-1 text-center"
                >
                    <div
                        v-if="currentStep === UploadState.STEP2"
                        aria-label="Loading..."
                        role="status"
                        class="mr-2 flex justify-center align-middle"
                    >
                        <svg class="h-6 w-6 animate-spin fill-primary" viewBox="3 3 18 18">
                            <path
                                class="opacity-20"
                                d="M12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5ZM3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z"
                            ></path>
                            <path
                                d="M16.9497 7.05015C14.2161 4.31648 9.78392 4.31648 7.05025 7.05015C6.65973 7.44067 6.02656 7.44067 5.63604 7.05015C5.24551 6.65962 5.24551 6.02646 5.63604 5.63593C9.15076 2.12121 14.8492 2.12121 18.364 5.63593C18.7545 6.02646 18.7545 6.65962 18.364 7.05015C17.9734 7.44067 17.3403 7.44067 16.9497 7.05015Z"
                            ></path>
                        </svg>
                    </div>
                    <BadgeCheck size="25" color="#23C15D" v-if="currentStep > UploadState.STEP2" />
                </div>
            </div>

            <div
                class="flex w-[200px] flex-row items-center justify-center px-2 py-1 text-center"
                :class="{ [classCompleted]: currentStep === UploadState.STEP3 }"
            >
                <div :class="{ 'text-primary': currentStep > UploadState.STEP3 }" class="w-[160px]">
                    Upload du fichier
                </div>
                <div
                    class="flex h-[40px] w-[40px] flex-row items-center justify-center px-2 py-1 text-center"
                >
                    <div
                        v-if="currentStep === UploadState.STEP3"
                        aria-label="Loading..."
                        role="status"
                        class="mr-2 flex justify-center align-middle"
                    >
                        <svg class="h-6 w-6 animate-spin fill-primary" viewBox="3 3 18 18">
                            <path
                                class="opacity-20"
                                d="M12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5ZM3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z"
                            ></path>
                            <path
                                d="M16.9497 7.05015C14.2161 4.31648 9.78392 4.31648 7.05025 7.05015C6.65973 7.44067 6.02656 7.44067 5.63604 7.05015C5.24551 6.65962 5.24551 6.02646 5.63604 5.63593C9.15076 2.12121 14.8492 2.12121 18.364 5.63593C18.7545 6.02646 18.7545 6.65962 18.364 7.05015C17.9734 7.44067 17.3403 7.44067 16.9497 7.05015Z"
                            ></path>
                        </svg>
                    </div>
                    <BadgeCheck size="25" color="#23C15D" v-if="currentStep > UploadState.STEP3" />
                </div>
            </div>

            <div
                class="flex w-[200px] flex-row items-center justify-center px-2 py-1 text-center"
                :class="{
                    [classCompleted]: currentStep === UploadState.COMPLETE,
                }"
            >
                <div
                    :class="{
                        'text-primary': currentStep === UploadState.COMPLETE,
                    }"
                >
                    Fichier sauvegardé
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    loading: {
        type: Boolean,
        required: true,
    },
    currentStep: {
        type: String,
        required: true,
    },
});

import { BadgeCheck } from 'lucide-vue-next';
enum UploadState {
    STEP1 = 'STEP1',
    STEP2 = 'STEP2',
    STEP3 = 'STEP3',
    COMPLETE = 'STEP4',
}
const classCompleted = 'bg-gray-500 rounded-xl text-white';
</script>
