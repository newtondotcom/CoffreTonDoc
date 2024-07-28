<template>
    <div>
        <Button @click="connectWallet">Connect Wallet</Button>
        <Button @click="signInWithEthereum">Sign In with Ethereum</Button>
        <Button @click="getInformation">Get Information</Button>
    </div>
</template>

<script setup lang="ts">
    import { BrowserProvider } from 'ethers';
    import { SiweMessage } from 'siwe';
    import { setAddValue, getAddValue } from '~/utils/cookie';

    let scheme: any;
    let domain: any;
    let origin: any;
    let provider: any;

    onMounted(() => {
        scheme = window.location.protocol.slice(0, -1);
        domain = window.location.host;
        origin = window.location.origin;
        provider = new BrowserProvider(window.ethereum);
        //provider = window.ethereum;
    });

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
            nonce: res.body,
        });
        return message.prepareMessage();
    }

    function connectWallet() {
        provider
            .send('eth_requestAccounts', [])
            .catch(() => console.log('user rejected request'))
            .then((data) => console.log('connected', data));
    }

    function getAddress() {
        provider.send('eth_accounts', []).then((data) => console.log('addresses', data.result[0]));
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

        if (res.status === 200) {
            const address = await signer.getAddress();
            setAddValue(address);
            navigateTo('/platform');
        } else {
            console.log('failed');
        }
    }

    async function getInformation() {
        const res = await $fetch(`/api/auth/personal_information`, {
            credentials: 'include',
        });
        console.log(res);
    }
</script>
