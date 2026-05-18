import { Worker, Job } from 'bullmq';
import { Redis } from 'ioredis';
import { calculatePoints } from '../pointscalculation/pc.service.ts';
import { prisma } from '../config/prisma.ts';
import { updateMatchStatus } from '../services/matchstatusupdate.service.ts';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const redisConnection = new Redis(redisUrl, {
    maxRetriesPerRequest: null,
    tls: redisUrl.includes('localhost') ? undefined : {}
});

// 1. Create a Worker that listens to the 'prediction-tasks' queue
export const predictionWorker = new Worker(
    'prediction-tasks', 
    async (job: Job) => {
        if (job.name === 'calculate-points') {
            console.log(`[Worker] Started calculating points for match: ${job.data.matchId}...`);
            
            try {
                // Call the actual points calculation logic!
                const result = await calculatePoints({ matchId: Number(job.data.matchId) });
                console.log(`[Worker] Finished calculating points for match: ${job.data.matchId}! Result:`, result);
            } catch (error: any) {
                console.error(`[Worker] Error calculating points for match ${job.data.matchId}:`, error);
                throw error; // Throw so BullMQ knows the job failed and can retry it
            }
        }

    // --- Automatic Lock Match Job ---

    if (job.name === 'lock-matches-check') {
            console.log(`[Worker] Checking for matches that need to be locked...`);
            try {
                const now = new Date();
                
                // Find all matches with status 1 (open) where sessionStartDate is <= now
                const matchesToLock = await prisma.match.findMany({
                    where: {
                        status: 1,
                        sessionStartDate: {
                            lte: now
                        }
                    }
                });
                if (matchesToLock.length === 0) {
                    console.log(`[Worker] No matches need to be locked right now.`);
                    return;
                }
                console.log(`[Worker] Found ${matchesToLock.length} match(es) to lock.`);
                for (const match of matchesToLock) {
                    console.log(`[Worker] Automatically locking match: ${match.matchId}`);
                    await updateMatchStatus(match.matchId, 2);
                }
            } catch (error: any) {
                console.error(`[Worker] Error running lock-matches-check background job:`, error);
                throw error;
            }
        }
    }
    , 
    { connection: redisConnection }
);



// 2. Add some listeners so you can see what's happening in your console
predictionWorker.on('completed', (job: Job) => {
     if (job.name !== 'lock-matches-check') {
        console.log(`[Worker] Job ${job.id} (${job.name}) has completed!`);
    }
});

predictionWorker.on('failed', (job: Job | undefined, err: Error) => {
    console.log(`[Worker] Job ${job?.id} (${job?.name}) failed with error ${err.message}`);
});