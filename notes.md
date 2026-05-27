npm init -y

npm install fastify @fastify/cors @fastify/helmet @fastify/swagger @fastify/swagger-ui
npm install -D typescript tsx @types/node
npm install dotenv
npm install
npm install zod
npx tsc --init
npm i --save-dev @types/node

npm install fastify-plugin

npm run dev
npm install pino-pretty

npm install prisma @prisma/client
npx prisma init


CREATE SCHEMA login;
CREATE SCHEMA master;
CREATE SCHEMA admin;
CREATE SCHEMA gameplay;

npx prisma migrate dev --name init_multi_schema

npx prisma migrate reset  --- reset // delete all data 
npx prisma migrate resolve --rolled-back 20260403081554_init  // rollback specific migration


npm install bcrypt
npm install -D @types/bcrypt

 npm install @prisma/adapter-pg pg -D @types/pg                                      

npm install @prisma/adapter-pg pg
npm install -D @types/pg

npm install

npx prisma generate

npm install @fastify/jwt

<!-- population -->
RAW DATA → CLEAN DATA → BUSINESS LOGIC → DATABASE


CREATE A JSON FILE --- FEED FILE 

CREATE A FOLDER DATA --- ADD FEED FILE 

CREATE A FOLDER IN SRC --- SCRIPTS --- CREATE A NEW SEEDFILE.TS  --- CLEAN & TRANSFORM THE DATA 

npm install ts-node --save-dev   //Install ts-node


Add in package.json

"scripts": {
  "seed:f1": "ts-node src/scripts/seedF1Data.ts"
}


You run → npm run seed:f1 // if u want to poplate manually 

seed.route.ts
      ↓
seed.service.ts   // logic  -> decides what to do with it
      ↓
f1.transformer.ts   // transform raw data  --> gives clean data  
      ↓
team.service / player.service / match.service
      ↓
Prisma → Database  // data insertion

<!-- -----------------------STATUS UPDATE --------------------------------- -->

MATCH 

0 → NOT_STARTED
1 → OPEN 
2 → LOCKED 
3 → PC STARTED       
4 -> PC DONE

QUESTION 

0 → DRAFT
1 → OPEN
2 → LOCKED 
3 -> RESOLVED    
4 -> PC DONE 


<!-- -----------------FRONTEND-------------------------- -->
npm create vite@latest frontend -- --template react-ts


cd frontend
npm install axios lucide-react
npm install axios
npm install @types/axios

npm install react-router-dom   // cd frontend
npm install @types/react-router-dom

<!-- ---------------------------REDIS  -->
npm install ioredis

Create a new file: src/config/redis.ts.

 Latency is the time it takes for a request to travel and get a response.

 The request travels over the internet.
Your Server receives it.
Your Server sends a query to the Database (PostgreSQL).
The Database searches through thousands of rows, calculates sums, sorts them, and joins them with the User table. (This is usually where the high latency comes from!)
The Database sends it back to the Server, which sends it to the User.

How Redis Reduces Latency (The "Memory Cache")
Redis is an "In-Memory" data store. While PostgreSQL stores data on a hard drive (which is slow but permanent), Redis stores data in RAM (which is incredibly fast but temporary).

The Strategy (Caching): Instead of asking the slow Database every single time a user refreshes the page, we do this:

User asks for the Leaderboard.
Server checks Redis first: "Do you already have the result for League #7?"
If Redis says "Yes" (Cache Hit): We send it back immediately. Latency drops from ~200ms to ~5ms.
If Redis says "No" (Cache Miss): We ask the Database, get the result, save a copy in Redis for next time, and then send it to the user.



Moving from simple caching to Redis Sorted Sets is how the "big players" (like F1, FIFA, or Call of Duty) build their real-time leaderboards. It is significantly more powerful than what we have now.

What is a Redis Sorted Set?
In Redis, a Sorted Set (also called a ZSET) is a collection of unique "members" (like User IDs), where every member is paired with a "score" (like Points).

The Magic: Redis keeps the list permanently sorted by the score. Every time you change a score, Redis instantly moves that user to their new rank.

Why use it instead of Prisma?
Feature	Your Current Way (Prisma)	The Pro Way (Redis Sorted Set)
Speed	Slow. DB has to sum, sort, and join rows every time.	Instant. Redis already has the list sorted in RAM.
Ranking	Hard. You have to count everyone above a user.	native. Just ask ZREVRANK for an instant rank.
Updates	Heavy. Requires re-calculating the whole table.	Light. Just update one user's score; Redis handles the rest.
How it is used (The Commands)
Here are the 3 commands you will use to build your real-time leaderboard:

ZADD (Add/Update): await redis.zadd('leaderboard:global', points, userId); (If the user exists, it updates their points. If not, it adds them.)

ZREVRANGE (Get Top Players): await redis.zrevrange('leaderboard:global', 0, 9, 'WITHSCORES'); (Gets the top 10 players from highest to lowest score.)

ZREVRANK (Get User Rank): await redis.zrevrank('leaderboard:global', userId); (Instantly tells you if a user is 1st, 50th, or 10,000th.)


<!-- DOCKER -->
in cmd 

wsl -d Ubuntu-24.04    // connect to wsl

docker 

docker -v     // check version of docker

docker ps      // see running container

docker run -it ubuntu:24.04    // run container 
      // -it is for interactive terminal

docker image is the blueprint / template / snapshot of container 

docker container is the running instance of an image


docker container ls  // list all the running containers 
docker container ls -a // list all the containers including stopped ones


docker start  


predictor_admin

postgresql://ritika:jdkpNrgz17mJDi0GMRXkqN8KNmQR3prC@dpg-d85fmvjrjlhs73dvc95g-a/predictor_r4wh

redis-cli --tls -u redis://default:gQAAAAAAAfdXAAIgcDIxZDNhOTE1YzlhNGE0Y2Y2OGM5MmZiY2NlZTY0M2QwNw@fit-lamprey-128855.upstash.io:6379


external 

postgresql://ritika:jdkpNrgz17mJDi0GMRXkqN8KNmQR3prC@dpg-d85fmvjrjlhs73dvc95g-a.oregon-postgres.render.com/predictor_r4wh