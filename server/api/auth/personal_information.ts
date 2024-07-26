import { defineEventHandler, readBody } from 'h3';
import { ethers } from 'ethers';
import { SiweMessage } from 'siwe';
import { getSession } from 'h3';

export default defineEventHandler(async (event) => {
    const session = await getSession(event);

    if (!session.siwe) {
        return {
            status: 401,
            body: { message: 'You have to first sign_in' },
        };
    }

    console.log('User is authenticated!');
    return {
        status: 200,
        headers: {
            'Content-Type': 'text/plain',
        },
        body: `You are authenticated and your address is: ${session.siwe.address}`,
    };
});
