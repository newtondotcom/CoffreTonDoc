import { defineEventHandler, readBody, getSession } from 'h3';
import { SiweMessage } from 'siwe';

export default defineEventHandler(async (event) => {
    const session = await getSession(event);
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

        session.siwe = message;
        session.cookie.expires = new Date(message.expirationTime);
        return {
            status: 200,
            body: true,
        };
    } catch (e) {
        session.siwe = null;
        session.nonce = null;
        console.error(e);
        switch (e) {
            case ErrorTypes.EXPIRED_MESSAGE: {
                return {
                    status: 440,
                    body: { message: e.message },
                };
            }
            case ErrorTypes.INVALID_SIGNATURE: {
                return {
                    status: 422,
                    body: { message: e.message },
                };
            }
            default: {
                return {
                    status: 500,
                    body: { message: e.message },
                };
            }
        }
    }
});
