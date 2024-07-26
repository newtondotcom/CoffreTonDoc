<template>
    <div>
        <button @click="connectWallet">Connect Wallet</button>
        <button @click="signInWithEthereum">Sign In with Ethereum</button>
        <button @click="getInformation">Get Information</button>
    </div>
</template>

<script setup lang="ts">
    import { ethers } from 'ethers';
    import { SiweMessage } from 'siwe';

    const scheme = window.location.protocol.slice(0, -1);
    const domain = window.location.host;
    const origin = window.location.origin;
    const provider = new ethers.providers.BrowserProvider(window.ethereum);

    async function createSiweMessage(address: string, statement: string) {
        const res = await $fetch(`/api/auth/nonce`, {
            credentials: 'include',
        });
        const message = new SiweMessage({
            scheme,
            domain,
            address,
            statement,
            uri: origin,
            version: '1',
            chainId: '1',
            nonce: await res.text(),
        });
        return message.prepareMessage();
    }

    function connectWallet() {
        provider.send('eth_requestAccounts', []).catch(() => console.log('user rejected request'));
    }

    async function signInWithEthereum() {
        const signer = await provider.getSigner();

        const message = await createSiweMessage(
            await signer.getAddress(),
            'Sign in with Ethereum to the app.',
        );
        const signature = await signer.signMessage(message);

        const res = await $fetch(`/api/auth/verify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message, signature }),
            credentials: 'include',
        });
        console.log(await res.text());
    }

    async function getInformation() {
        const res = await $fetch(`/api/auth/personal_information`, {
            credentials: 'include',
        });
        console.log(await res.text());
    }
</script>
