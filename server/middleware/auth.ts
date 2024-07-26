import { useSession } from 'h3';

export default eventHandler(async (event) => {
    const config = useRuntimeConfig();
    const session = await useSession(event, {
        password: config.ENCRYPTION_KEY,
    });
    const allowedRoutes = [''];
    if (
        session.data.nonce &&
        session.data.siwe &&
        session.data.nonce == session.data.siwe.nonce &&
        session.data.siwe.address
    ) {
        event.context.user_id = session.data.siwe.address;
    } else {
        if (event.node.req.url?.startsWith('auth/') || allowedRoutes.includes(event.node.req.url)) {
            console.error('Unauthenticated route :', event.node.req.url);
            throw { statusMessage: 'Unauthenticated', statusCode: 403 };
        }
    }
});
