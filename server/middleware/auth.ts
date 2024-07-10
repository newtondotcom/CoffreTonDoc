import { getServerSession, getToken } from '#auth';

export default eventHandler(async (event) => {
    const session = await getServerSession(event);
    const allowedRoutes: String[] = [''];
    if (event.node.req.url?.startsWith('auth/') || allowedRoutes.includes(!event.node.req.url)) {
        console.error('Unauthenticated route :', event.node.req.url);
        throw { statusMessage: 'Unauthenticated', statusCode: 403 };
    } else if (session) {
        event.context.user_id = session.user.id;
    }
});
