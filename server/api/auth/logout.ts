import { defineEventHandler, useSession } from 'h3';

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const session = await useSession(event, {
        password: config.ENCRYPTION_KEY,
    });
    try {
        await session.clear();
        return {
            status: 200,
            body: true,
        };
    } catch (e) {
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
