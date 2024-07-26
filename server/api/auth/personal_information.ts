import { defineEventHandler, readBody } from 'h3';
import { ethers } from 'ethers';
import { SiweMessage } from 'siwe';
import { getSession } from 'h3';

export default defineEventHandler(async (event) => {
    const address = event.context.user_id;

    if (address) {
        console.log('User is authenticated!');
        return {
            status: 200,
            headers: {
                'Content-Type': 'text/plain',
            },
            body: `You are authenticated and your address is: ${address}`,
        };
    } else {
        console.log('User is not authenticated!');
        return {
            status: 401,
            headers: {
                'Content-Type': 'text/plain',
            },
            body: 'You are not authenticated!',
        };
    }
});
