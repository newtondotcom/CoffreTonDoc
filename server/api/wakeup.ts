import { defineEventHandler } from 'h3';
import prisma from '../data/prisma';

export default defineEventHandler(async (event) => {
    const user = await prisma.user.create({
        data: {
            name: `,1212dzqsdsqdzééééé"!&"&é"&:"&"&`,
        },
        select: {
            id: true,
        },
    });
    await prisma.user.delete({
        where: {
            id: user.id,
        },
    });

    return {
        status: 200,
        headers: {
            'Content-Type': 'text/plain',
        },
    };
});
