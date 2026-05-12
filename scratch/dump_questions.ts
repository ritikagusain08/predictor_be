import { prisma } from '../src/config/prisma.ts';

async function main() {
    const questions = await prisma.question.findMany({
        where: { matchId: 1003 },
        include: {
            options: true
        }
    });
    console.log(JSON.stringify(questions, null, 2));
}

main();
