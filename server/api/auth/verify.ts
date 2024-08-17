import { defineEventHandler, readBody, useSession } from 'h3';
import { SiweMessage } from 'siwe';
import { subtle } from 'crypto';

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const session = await useSession(event, {
        password: config.ENCRYPTION_KEY,
    });

    const body = await readBody(event);

    if (!body.message) {
        return {
            status: 422,
            body: { message: 'Expected prepareMessage object as body.' },
        };
    }

    try {
        let SIWEObject = new SiweMessage(body.message);
        const { data: message } = await SIWEObject.verify({
            signature: body.signature,
            nonce: session.data.nonce,
        });

        // Hash the Ethereum address from the message
        const hashedAddress = await hashEthAddress(message.address);

        // Update the session with the hashed address
        await session.update({
            siwe: { ...message, address: hashedAddress },
        });

        return {
            status: 200,
            body: { hashedAddress, address: message.address },
        };
    } catch (e) {
        await session.clear();
        console.error(e);
        switch (e) {
            default: {
                return {
                    status: 500,
                    body: { message: e.message },
                };
            }
        }
    }
});

/**
 * Hashes an Ethereum address using SHA-256.
 * @param {string} ethAddress - The Ethereum address to hash.
 * @returns {Promise<string>} A promise that resolves to the hash of the Ethereum address as a hex string.
 */
async function hashEthAddress(ethAddress: string): Promise<string> {
    // Normalize the Ethereum address (remove the '0x' prefix and convert to lowercase)
    const normalizedAddress = ethAddress.toLowerCase().replace(/^0x/, '');

    // Convert the address to a byte array
    const addressBytes = new TextEncoder().encode(normalizedAddress);

    // Hash the address using SHA-256
    const hashBuffer = await subtle.digest('SHA-256', addressBytes);

    // Convert the hash buffer to a hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('');

    return hashHex;
}
