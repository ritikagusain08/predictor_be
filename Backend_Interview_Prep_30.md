# 🚀 Top 30 Backend Interview Questions (Project & General)

This guide is tailored to the technologies used in your project (**Fastify, Prisma, Redis, TypeScript, Docker**) and general backend engineering principles.

---

## 🛠 Part 1: Project-Specific Questions
*These questions focus on the architectural decisions and implementations within your current project.*

### 1. Why did we move the Leaderboard logic from SQL to Redis Sorted Sets?
**Answer:** SQL queries (e.g., `SUM` and `ORDER BY`) become slow as the dataset grows because they have $O(N \log N)$ or $O(N)$ complexity. Redis Sorted Sets (`ZSET`) maintain data in a pre-sorted state using a skip-list data structure. This makes retrieving the top 10 players an $O(\log N)$ operation, which is nearly instantaneous even with millions of users.

### 2. Explain how `ZADD` and `ZREVRANGE` work in your Leaderboard service.
**Answer:** 
- `ZADD`: Adds or updates a user's score in the sorted set. If the user already exists, it updates the score.
- `ZREVRANGE`: Retrieves a range of members from the set, sorted from high to low (descending). We use this to get the "Top 10" or "Rankings".

### 3. How do you handle many-to-many relationships in Prisma for this project?
**Answer:** In the project (e.g., Users joining multiple Leagues), we use a "Join Table" approach or Prisma's implicit many-to-many. Explicit join tables are preferred when we need to store extra metadata (like `joinedAt` or `role`). Prisma simplifies this by allowing us to query related data using `include` or `select`.

### 4. Why use Zod for validation if we already have TypeScript?
**Answer:** TypeScript is for **compile-time** safety (it disappears after build). Zod is for **runtime** validation. It ensures that the data coming from an external API or user input actually matches the schema before your logic executes, preventing "undefined" errors at runtime.

### 5. How did you implement authentication in this Fastify project?
**Answer:** We used `@fastify/jwt` for token-based authentication and `bcrypt` for password hashing.
1. User logs in -> Password verified with `bcrypt.compare`.
2. A JWT is generated containing the `userId`.
3. A Fastify `preHandler` hook (middleware) verifies the JWT on protected routes and attaches the user payload to `request.user`.

### 6. What are Fastify Hooks and how do they differ from Express middleware?
**Answer:** Fastify hooks (like `onRequest`, `preHandler`, `onResponse`) provide granular control over the Request/Response lifecycle. Unlike Express middleware which is a linear chain, Fastify hooks are optimized for performance and allow you to "hook" into specific stages of the request processing.

### 7. How does the Docker setup work for this project?
**Answer:** We use `docker-compose.yml` to orchestrate multiple containers:
- **App Container**: The Node.js server.
- **Database Container**: PostgreSQL.
- **Cache Container**: Redis.
This ensures that the environment is identical across development, staging, and production.

### 8. How do you handle database migrations in a team environment with Prisma?
**Answer:** We use `npx prisma migrate dev`. This generates SQL files that are tracked in Git. When another developer pulls the code, they run the same command to sync their local database schema with the team's latest changes.

### 9. What is the Service Pattern and why did we use it?
**Answer:** We separate logic into `Controllers` (handle HTTP requests) and `Services` (handle business logic/database calls). This makes the code **testable**, **reusable**, and **clean**. If we ever move from Fastify to another framework, the core business logic in the services remains unchanged.

### 10. How do you ensure data integrity during a "Join League" operation?
**Answer:** We use **Prisma Transactions** (`prisma.$transaction`). If a user joins a league, we might need to increment a counter and add a record. A transaction ensures that if one step fails, all steps are rolled back, preventing "partial" or "corrupt" data.

### 11. How would you handle a sudden spike in traffic (e.g., during an F1 race start)?
**Answer:** 
1. **Vertical Scaling**: Increase CPU/RAM.
2. **Horizontal Scaling**: Run multiple instances of the app behind a Load Balancer (Nginx).
3. **Caching**: Use Redis to serve the leaderboard and match data without hitting PostgreSQL.
4. **Rate Limiting**: Prevent abuse using `@fastify/rate-limit`.

### 12. Explain the purpose of `ioredis` in this project.
**Answer:** `ioredis` is a robust Redis client for Node.js. It supports advanced features like Sentinel (for high availability), Cluster, and Pipelining. We use it to communicate with our Redis instance for leaderboard and caching operations.

### 13. How do you handle environment variables safely?
**Answer:** We use a `.env` file for local development (ignored by Git) and the `dotenv` package. For production, we inject these variables via Docker or the hosting provider's dashboard to keep secrets like `DATABASE_URL` and `JWT_SECRET` secure.

### 14. What are Prisma Extensions?
**Answer:** They allow us to add custom functionality to the Prisma Client globally. For example, adding a custom method to "soft delete" records or automatically hashing passwords whenever a User is created.

### 15. How do you map Redis `userId`s back to Usernames for the Frontend?
**Answer:** Since Redis only stores the `userId` and `score`, we have two options:
1. **MGET**: Fetch all user profiles from Redis/PostgreSQL after getting the IDs from `ZREVRANGE`.
2. **Hash Mapping**: Store a separate Redis Hash (`HSET`) mapping `userId` to `username` for ultra-fast lookup.

---

## 🌍 Part 2: General Backend Interview Questions
*Foundational concepts every backend engineer should know.*

### 16. Explain the Node.js Event Loop.
**Answer:** Node.js is single-threaded but handles concurrency via the Event Loop. It has phases:
- **Timers**: `setTimeout`, `setInterval`.
- **Pending Callbacks**: I/O errors.
- **Poll**: Retrieve new I/O events.
- **Check**: `setImmediate`.
- **Close Callbacks**: `socket.on('close')`.
*Microtasks* (`process.nextTick` and Promises) run between every phase.

### 17. What is the difference between `process.nextTick()` and `setImmediate()`?
**Answer:** `process.nextTick()` fires **immediately** after the current operation finishes (before the next phase of the event loop). `setImmediate()` fires in the **Check phase** of the next loop iteration.

### 18. How do you handle CPU-intensive tasks in Node.js?
**Answer:** Since Node.js is single-threaded, CPU-heavy tasks block the event loop. Solutions include:
- **Worker Threads**: Run JavaScript in parallel on separate threads.
- **Child Processes**: Spawn a separate process.
- **Offloading**: Move the task to a message queue (like BullMQ) and a separate worker service.

### 19. What is Dependency Injection (DI)?
**Answer:** DI is a design pattern where a class receives its dependencies from the outside rather than creating them itself. This makes testing easy because you can "inject" a mock database service during tests.

### 20. Explain SQL vs NoSQL. When to use what?
**Answer:** 
- **SQL (PostgreSQL)**: Relational, strict schema, ACID compliance. Best for complex queries, financial data, and structured relationships (like our Leagues/Users).
- **NoSQL (MongoDB)**: Document-based, flexible schema, horizontal scaling. Best for rapidly changing data structures or massive logs.

### 21. What are the 4 properties of ACID in databases?
**Answer:** 
- **Atomicity**: All or nothing.
- **Consistency**: Valid state.
- **Isolation**: Concurrent transactions don't interfere.
- **Durability**: Data persists after a crash.

### 22. What is a Race Condition?
**Answer:** Occurs when two or more operations happen at the same time, and the final result depends on the timing. Example: Two users joining a "Full" league at the exact same millisecond. Solved using **Database Locks** or **Transactions**.

### 23. Explain REST vs GraphQL.
**Answer:** 
- **REST**: Multiple endpoints, can lead to over-fetching (getting more data than needed) or under-fetching.
- **GraphQL**: Single endpoint, client specifies exactly what data they want. Great for complex frontends but harder to cache.

### 24. What is a "N+1" Query Problem and how does Prisma solve it?
**Answer:** Occurs when you fetch a list (1 query) and then fetch details for each item in a loop (N queries). Prisma solves this using `include` or `select`, which performs efficient SQL Joins or batched queries.

### 25. How do you implement Rate Limiting?
**Answer:** Track the number of requests per IP in Redis with an expiration time. If the count exceeds a threshold, return HTTP 429 (Too Many Requests).

### 26. What is the difference between a Session and a JWT?
**Answer:** 
- **Session**: Stateful. Server stores session data in memory/DB; client has a `sessionId` cookie.
- **JWT**: Stateless. All data is in the token itself (encoded). Server doesn't need to store it, making it easier to scale horizontally.

### 27. What are Streams in Node.js?
**Answer:** Streams allow you to process data piece-by-piece instead of loading the whole file into RAM. Essential for processing large logs or video files.

### 28. What is Cross-Origin Resource Sharing (CORS)?
**Answer:** A security feature that allows/restricts resources on a web page to be requested from another domain. We configure it in Fastify via `@fastify/cors`.

### 29. Explain Vertical vs Horizontal Scaling.
**Answer:** 
- **Vertical**: "Scale Up" by adding more CPU/RAM to a single machine.
- **Horizontal**: "Scale Out" by adding more machines/containers.

### 30. What is a "Graceful Shutdown"?
**Answer:** When the server stops, it should finish processing current requests, close database connections, and clear intervals before exiting. In Node, we listen to `SIGTERM` and `SIGINT` signals to trigger this.

---
