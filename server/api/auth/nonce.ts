import { defineEventHandler } from 'h3';
import { generateNonce } from 'siwe';
import { useSession } from 'h3';

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const session = await useSession(event, {
        password: config.ENCRYPTION_KEY,
        maxAge: 60 * 60 * 24 * 7,
    });
    const nonce = generateNonce();
    await session.update({
        nonce,
    });
    return {
        status: 200,
        headers: {
            'Content-Type': 'text/plain',
        },
        body: nonce,
    };
});
