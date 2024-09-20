<template>
    <input type="file" @change="up" />
    <button @click="dl">download</button>
</template>

<script setup lang="ts">
    import { uint8ArrayToBase64, base64ToUint8Array } from '~/utils/crypto';
    const objectName = 'test';
    const ethAddress = ref<string | null>(null);

    async function readFile(file: File): Promise<Uint8Array> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(new Uint8Array(reader.result as ArrayBuffer));
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        });
    }

    const arraysEqual = (a: Uint8Array, b: Uint8Array): boolean => {
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) return false;
        }
        return true;
    };

    async function uploadFile(dataToUpload: Uint8Array) {
        const base64String = uint8ArrayToBase64(dataToUpload);
        const response = await $fetch('/api/test', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: { file: base64String },
        });
        const base64File = response.file;
        const file: Uint8Array = base64ToUint8Array(base64File);
        const ethAddress = getAddValue(); // Ensure this function is defined and returns a valid value
        const key = await deriveKeyFromEthAddress(ethAddress); // Ensure this function is defined and returns a valid value
        const decryptedData = await decryptFile(key, file);
        console.log('Decrypted Data:', decryptedData);
        const blob = new Blob([decryptedData]);
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'test';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        console.log('File read:', file.length);
    }
    async function up(event: Event) {
        const target = event.target as HTMLInputElement;
        if (target.files && target.files[0]) {
            const file = target.files[0];
            const ethAddress = getAddValue(); // Ensure this function is defined and returns a valid value
            const data = await readFile(file);
            console.log('File read:', data.length);
            const key = await deriveKeyFromEthAddress(ethAddress); // Ensure this function is defined and returns a valid value
            const encryptedData: Uint8Array = await encryptFile(key, data); // Ensure this function is defined and returns a valid value
            console.log('File read:', encryptedData.length);

            // Upload the file
            await uploadFile(encryptedData);
        }
    }
</script>
