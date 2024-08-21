<template>
    <div>
        <Button @click="signInWithEthereum">
            <svg
                role="img"
                viewBox="0 0 24 24"
                class="mr-1 h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
            >
                <title>Ethereum</title>
                <path
                    fill="currentColor"
                    d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z"
                />
            </svg>
            Sign In with Ethereum
        </Button>
    </div>
</template>

<script setup lang="ts">
    import { useToast } from '@/components/ui/toast/use-toast';
    const { toast } = useToast();
    import { useI18n } from '#imports';
    const { t } = useI18n();

    import { BrowserProvider } from 'ethers';
    import { SiweMessage } from 'siwe';
    import { setAddValue, setHashAddValue } from '~/utils/cookie';

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
            const hasedhAddress = res.body.hashedAddress;
            const address = res.body.address;
            setAddValue(address);
            setHashAddValue(hasedhAddress);
            toast({
                title: t('success'),
                message: t('login_success'),
            });
            navigateTo('/platform');
        } else {
            toast({
                title: t('error'),
                message: t('login_error'),
                variant: 'destructive',
            });
            console.log('failed');
        }
    }
</script>
