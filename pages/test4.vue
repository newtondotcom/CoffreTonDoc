<template>
    <input type="file" @change="up" />
    <button @click="dl">download</button>
</template>

<script setup lang="ts">
    const objectName = 'test';
    const req = await $fetch('/api/test');
    const link = req.link;
    const download = req.download;
    const length = ref(0);
    const encryptedData = ref(new Uint8Array(0));

    const arraysEqual = (a: Uint8Array, b: Uint8Array) => {
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) return false;
        }
        return true;
    };

    const up = async (event) => {
        const file = event.target.files[0];
        const ethAddress = getAddValue();
        const data = await readFile(file);
        console.log('File read:', data.length);
        const key = await deriveKeyFromEthAddress(ethAddress);
        encryptedData.value = await encryptFile(key, data);
        console.log('Encrypted data:', encryptedData.value.length);
        length.value = encryptedData.value.length;
        await uploadFile(encryptedData, link);
        console.log('File uploaded');
        await dl();
    };

    const dl = async () => {
        const ethAddress = getAddValue();
        const key = await deriveKeyFromEthAddress(ethAddress);
        const fileFetch = await fetch(download);
        const encryptedData: Uint8Array = new Uint8Array(await fileFetch.arrayBuffer());
        console.log('Downloaded data:', encryptedData.length);
        //console.log(arraysEqual(local, encryptedData.value));
        const decryptedData = await decryptFile(key, encryptedData);
        console.log('Decrypted data:', decryptedData.length);
    };
</script>
