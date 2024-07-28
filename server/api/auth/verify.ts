import { defineEventHandler, readBody, useSession } from 'h3';
import { SiweMessage } from 'siwe';

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
            nonce: session.nonce,
        });

        await session.update({
            siwe: message,
        });

        return {
            status: 200,
            body: true,
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
