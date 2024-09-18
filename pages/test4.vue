<template>
    <input type="file" @change="up" />
    <button @click="dl">download</button>
</template>

<script setup lang="ts">
    const objectName = 'test';
    const req = await $fetch('/api/test');
    const link = req.link;
    const download = req.download;

    function readFile(file: File): Promise<Uint8Array> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(new Uint8Array(reader.result as ArrayBuffer));
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        });
    }

    const arraysEqual = (a: Uint8Array, b: Uint8Array) => {
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) return false;
        }
        return true;
    };

    async function uploadFile(dataToUpload: Uint8Array, url: string) {
        try {
            const formData = new FormData();
            formData.append('file', dataToUpload);
            await fetch(url, {
                method: 'PUT',
                body: formData,
            });
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    }

    const up = async (event) => {
        const file = event.target.files[0];
        const data = await readFile(file);
        console.log('File read:', data.length); // 1500066

        // Upload the file
        await uploadFile(data, link);
        console.log('File uploaded');

        // Download the file
        const fileFetch = await fetch(download);
        const data2: Uint8Array = new Uint8Array(await fileFetch.arrayBuffer());
        console.log('Downloaded data:', data2.length); // 5300707 or 5300703

        const cropped = data2.slice(0, data.length);
        console.log('Arrays equal:', arraysEqual(data, cropped)); // false
    };
</script>
