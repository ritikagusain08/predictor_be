import { Redis } from "ioredis";
import { env } from "./env.ts";

// export const redis = new Redis(env.REDIS_URL, {
//   retryStrategy: (times) => {
//     return Math.min(times * 50, 2000); // Reconnect after up to 2 seconds
//   },
// });
export const redis = new Redis(env.REDIS_URL, {
  tls: env.REDIS_URL.includes('localhost') ? undefined : { rejectUnauthorized: false },
  retryStrategy: (times) => {
    return Math.min(times * 50, 2000); // Reconnect after up to 2 seconds
  },
});


redis.on("error", (err) => {
  console.error("[Redis Error] Failed to connect:", err.message);
});

redis.on("connect", () => {
  console.log("[Redis] Connected successfully");
});
