import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const matchId = 1001;
  const status = 1;

  console.log(`Updating match ${matchId} status to ${status}...`);
  const updatedMatch = await prisma.match.update({
    where: { matchId },
    data: { status }
  });

  console.log('Match successfully updated:', updatedMatch);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
