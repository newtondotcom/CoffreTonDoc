<template>
    <div>
        <input @change="change" type="file" />
        <button @click="test">Test</button>
    </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    import { readFile, deriveKeyFromEthAddress, encryptFile, decryptFile } from '~/utils/crypto';

    // Page metadata (optional)
    definePageMeta({
        layout: false,
        auth: {
            unauthenticatedOnly: true,
            navigateAuthenticatedTo: '/',
        },
    });

    const config = useRuntimeConfig();
    const ethAddress = config.public.ETH_ADDRESS;
    const file = ref<File | null>(null);

    async function change(e: Event) {
        const target = e.target as HTMLInputElement;
        if (target.files && target.files[0]) {
            file.value = target.files[0];

            try {
                const data = await readFile(file.value);
                const key = await deriveKeyFromEthAddress(ethAddress);
                console.log('encrypting file');
                const encryptedData = await encryptFile(key, data);
                console.log('file is encrypted');
                console.log('Encrypted Data:', encryptedData);

                console.log('start decrypting');
                const decryptedData = await decryptFile(key, encryptedData);
                console.log('Decrypted Data:', decryptedData);

                // Compare original and decrypted data
                const arraysEqual = (a: Uint8Array, b: Uint8Array) => {
                    if (a.length !== b.length) return false;
                    for (let i = 0; i < a.length; i++) {
                        if (a[i] !== b[i]) return false;
                    }
                    return true;
                };

                console.log('Arrays are equal:', arraysEqual(data, decryptedData));

                // Rebuild and download the file
                const blob = new Blob([decryptedData], { type: file.value.type });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = file.value.name;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred.');
            }
        }
    }

    async function test() {
        // Placeholder for any future test functionality
    }
</script>
