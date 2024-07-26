import { defineEventHandler } from 'h3';
import { generateNonce } from 'siwe';
import { getSession } from 'h3';

export default defineEventHandler(async (event) => {
    const session = await getSession(event);
    const nonce = generateNonce();
    session.nonce = nonce;
    return {
        status: 200,
        headers: {
            'Content-Type': 'text/plain',
        },
        body: nonce,
    };
});
