<template>
  <div class="flex justify-center mt-8">
    <div class="flex items-center">
      <label class="mr-2">Two factor authentication</label>
      <input
        type="checkbox"
        class="form-checkbox h-5 w-5 text-teal-500"
        v-model="isEnabled"
        @change="isEnabled ? openDisableModal() : openSetupModal()"
      />
    </div>
    <div
      v-if="isOpenSetupModal"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div class="bg-white rounded-lg p-8">
        <h2 class="text-xl font-bold mb-4">Enable two-factor authentication</h2>
        <div v-if="step === SetupStep.ConfirmPassword">
          <input
            type="password"
            class="border rounded px-3 py-2 mb-4 w-full"
            placeholder="*******"
            v-model="password"
          />
          <div class="flex justify-end">
            <button
              class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
              @click="closeSetupModal()"
            >
              Close
            </button>
            <button
              class="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded"
              @click="handleSetup()"
            >
              Continue
            </button>
          </div>
        </div>
        <div v-if="step === SetupStep.DisplayQrCode">
          <p class="mb-4">
            Scan the image below with the authenticator app on your phone or
            manually enter the text code instead.
          </p>
          <img :src="dataUri" alt="QR Code" class="mb-4" />
          <div class="flex justify-end">
            <button
              class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
              @click="closeSetupModal()"
            >
              Close
            </button>
            <button
              class="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded"
              @click="step = SetupStep.EnterTotpCode"
            >
              Continue
            </button>
          </div>
        </div>
        <div v-if="step === SetupStep.EnterTotpCode">
          <p class="mb-2">Enter your code to enable 2FA</p>
          <input
            type="text"
            class="border rounded px-3 py-2 mb-4 w-full"
            v-model="totpCode"
          />
          <div class="flex justify-end">
            <button
              class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
              @click="closeSetupModal()"
            >
              Close
            </button>
            <button
              class="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded"
              @click="handleEnable()"
            >
              Enable
            </button>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="isOpenDisableModal"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div class="bg-white rounded-lg p-8">
        <h2 class="text-xl font-bold mb-4">
          Disable two-factor authentication
        </h2>
        <p class="mb-2">Enter your code to disable 2FA</p>
        <input
          type="text"
          class="border rounded px-3 py-2 mb-4 w-full"
          v-model="totpCode"
        />
        <div class="flex justify-end">
          <button
            class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
            @click="closeDisableModal()"
          >
            Close
          </button>
          <button
            class="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded"
            @click="handleDisable()"
          >
            Disable
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useToast } from "@/components/ui/toast/use-toast";
const { toast } = useToast();
const isOpenSetupModal = ref(false);
const isOpenDisableModal = ref(false);
const isEnabled = ref(false);
const SetupStep = {
  ConfirmPassword: 0,
  DisplayQrCode: 1,
  EnterTotpCode: 2,
};
const step = ref(SetupStep.ConfirmPassword);
const password = ref("");
const totpCode = ref("");
const dataUri = ref("");
const isSubmitting = ref(false);

const openSetupModal = () => {
  isOpenSetupModal.value = true;
};

const closeSetupModal = () => {
  isOpenSetupModal.value = false;
  resetState();
};

const openDisableModal = () => {
  isOpenDisableModal.value = true;
};

const closeDisableModal = () => {
  isOpenDisableModal.value = false;
  resetState();
};

const handleSetup = async () => {
  if (isSubmitting.value) {
    return;
  }

  isSubmitting.value = true;

  try {
    const response = await fetch(`/api/auth/totp/setup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password: password.value,
      }),
    });
    const body = await response.json();

    if (response.status === 200) {
      dataUri.value = body.dataUri;
      step.value = SetupStep.DisplayQrCode;
    } else if (body.error === ErrorCode.IncorrectPassword) {
      toast({
        title: "Incorrect Password",
        status: "error",
      });
    } else {
      toast({
        title: "Sorry something went wrong",
        status: "error",
      });
    }
  } catch (e) {
    toast({
      title: "Sorry something went wrong",
      status: "error",
    });
  } finally {
    isSubmitting.value = false;
  }
};

const handleEnable = async () => {
  if (isSubmitting.value) {
    return;
  }

  isSubmitting.value = true;

  try {
    const response = await fetch(`/api/auth/two-factor/totp/enable`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        totpCode: totpCode.value,
      }),
    });
    const body = await response.json();

    if (body.error === ErrorCode.IncorrectTwoFactorCode) {
      toast({
        title: "Incorrect code. Please try again",
        status: "error",
      });
    } else if (body.error) {
      toast({
        title: "Sorry something went wrong",
        status: "error",
      });
    } else {
      toast({
        title: "Successfully enabled 2FA",
        status: "success",
      });
    }

    onEnable();
  } catch (e) {
    toast({
      title: "Sorry something went wrong",
      status: "error",
    });
  } finally {
    isSubmitting.value = false;
  }
};

const handleDisable = async () => {
  if (isSubmitting.value) {
    return;
  }

  isSubmitting.value = true;

  try {
    const response = await fetch(`/api/auth/two-factor/totp/disable`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        totpCode: totpCode.value,
      }),
    });
    const body = await response.json();

    if (body.error === ErrorCode.IncorrectTwoFactorCode) {
      toast({
        title: "Incorrect code. Please try again",
        status: "error",
      });
    } else if (body.error) {
      toast({
        title: "Sorry something went wrong",
        status: "error",
      });
    } else {
      toast({
        title: "Successfully disabled 2FA",
        status: "success",
      });
    }

    onDisable();
  } catch (e) {
    toast({
      title: "Sorry something went wrong",
      status: "error",
    });
  } finally {
    isSubmitting.value = false;
  }
};

const resetState = () => {
  step.value = SetupStep.ConfirmPassword;
  password.value = "";
  totpCode.value = "";
  dataUri.value = "";
};
</script>
