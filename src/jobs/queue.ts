import { Queue } from 'bullmq';
import {Redis} from 'ioredis';

// 1. Connect to your existing Redis
// You can use your existing Redis URL from your environment variables
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const redisConnection = new Redis(redisUrl, {
    maxRetriesPerRequest: null,
    tls: redisUrl.includes('localhost') ? undefined : {}
});

// 2. Create a Queue named 'prediction-tasks'
export const predictionQueue = new Queue('prediction-tasks', { 
    connection: redisConnection 
});

console.log("Background Queue 'prediction-tasks' is ready!");


// 3. Add the repeatable job to check for matches that need to be locked every 60 seconds
predictionQueue.add('lock-matches-check', {}, {
    repeat: {
        every: 60000 // runs every 60,000 milliseconds (1 minute)
    },
    jobId: 'lock-matches-check' // ensures it is unique and won't be duplicated
}).then(() => {
    console.log("Successfully scheduled background match lock checker!");
}).catch(err => {
    console.error("Error scheduling background lock checker:", err);
});
