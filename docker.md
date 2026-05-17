
Docker is a containerization platform that packages your application and all its dependencies into a single, lightweight, and portable unit called a container.

Docker Image
A Docker image is a lightweight, standalone, executable package that includes everything needed to run a piece of software, including the code, runtime, libraries, and system tools.

Image: Think of this as a "blueprint" or a recipe. It contains your code, your dependencies, and the environment (like Node.js itself) all packaged together.

Docker Container
A Docker container is a running instance of a Docker image. It is an isolated process that runs on the host operating system but has its own filesystem, processes, and network stack.

Container: This is a running instance of your Image. If the Image is the recipe, the Container is the actual cake!

Container vs Image
Container: A running instance of an image (like a running process)
Image: A read-only template used to create containers (like a blueprint)


STEP 1:
Verify it works: Open up your PowerShell or Command Prompt
docker --version   // verify version  --- Docker version 29.4.3

Step 2: Creating the Blueprint (Dockerfile and .dockerignore)

To create our Image, we need a special text file simply named Dockerfile (no extension). Docker will read this file top-to-bottom to build your app.

We also need a .dockerignore file. Just like .gitignore prevents files from going to GitHub, .dockerignore prevents giant folders (like node_modules) from being copied into your Docker image, which keeps it fast and small.

Create a file named .dockerignore in your project root folder and add this:

text
node_modules
dist
.env
<!-- ------------------------------------------------------------ -->
Create a file named Dockerfile in your project root folder and add the code.


<!-- 1. Start with a lightweight Node.js environment -->
FROM node:20-alpine    

<!-- # FROM tells Docker which base image to start with -->
<!-- # node:20 is the version of Node.js we are using -->
<!-- # alpine is a lightweight Linux distribution that is used as the base image -->

<!-- # 2. Set the working directory INSIDE the container -->
WORKDIR /app

<!-- # WORKDIR sets the working directory INSIDE the container -->
<!-- # /app is the path inside the container where our application code will live -->

<!-- # 3. Copy only the package files first (Docker caches this step to make future builds faster) -->
COPY package*.json ./

<!-- # 4. Install your project dependencies -->
RUN npm install

<!-- # 5. Copy the Prisma folder and generate the database client -->
COPY prisma ./prisma/
RUN npx prisma generate

<!-- # 6. Copy the rest of your application code -->
COPY . .

<!-- # 7. Build the TypeScript code (based on your package.json scripts) -->
RUN npm run build

<!-- # 8. Expose the port your Fastify app runs on (assuming it's 3000) -->
EXPOSE 3000

<!-- # EXPOSE tells Docker which port the application inside the container will listen on -->
<!-- # This is just documentation; it does not actually publish the port -->

<!-- # 9. The command to run when the container starts -->
CMD ["npm", "start"]

<!-- ------------------------------------------------------ -->

Step 3: Enter Docker Compose (The Orchestrator)
Docker Compose is a tool that lets us define and run multiple containers at the exact same time using a single YAML file. 
They will automatically be put on the same "virtual network" so they can talk to each other!

Create a file named docker-compose.yml in your project root and add this:

<!-- --------------------------------------------------------------------------- -->

version: '3.8'

services:
  <!-- # 1. Our Database Container -->
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: mysecretpassword
      POSTGRES_DB: predictor_db
    ports:
      - "5432:5432"

  <!-- # 2. Our Redis Container -->
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  <!-- # 3. Our Node.js Application Container -->
  api:
    build: . # This tells Docker to build the Dockerfile in this directory!
    ports:
      - "3000:3000"
    environment:
      # The API needs to know how to talk to the db and redis containers
      # Notice how we use the service names 'db' and 'redis' in the URLs!
      DATABASE_URL: "postgresql://postgres:mysecretpassword@db:5432/predictor_db?schema=public"
      REDIS_URL: "redis://redis:6379"
    depends_on:
      - db
      - redis


<!-- Notice something super cool in the api environment variables: Instead of connecting to localhost:5432, we connect to db:5432. Docker Compose automatically resolves the service name db to the IP address of the database container! -->


Step 4: Running Everything Together (The Magic Command)
Now we are going to start the database, Redis, and your Node.js application all at the exact same time.

Your Task for Step 4: Open your terminal (PowerShell or Command Prompt) in the root of your project where your docker-compose.yml file is, and run this single command:


docker compose up --build

<!-- up means "read my docker-compose.yml and start all my containers." -->
<!-- --build tells Docker: "Please build my Node.js Image from the Dockerfile first before you start it." (You only need to add --build when you change your code or your Dockerfile). -->


Let's break down that command into its three parts so you know exactly what is happening behind the scenes:

1. docker compose
This tells your computer: "Hey Docker, look for a file named docker-compose.yml in this folder and get ready to manage all the services listed inside it."

2. up
This is the command to "bring everything up and online". It tells Docker to:

Go to the internet and download the official PostgreSQL and Redis images (if you don't have them already).
Create the virtual network so they can talk to each other.
Turn on all the containers so they are actively running.
(If you ever want to turn everything off, the opposite command is docker compose down!)

3. --build
This is a special flag for your custom Node.js application.

It tells Docker: "Before you start my api container, look at my Dockerfile and build a fresh image using my latest code."
If you didn't include --build, Docker might use an old, cached version of your app.
Rule of Thumb:

Use docker compose up --build if you recently changed your Node.js code or your Dockerfile.
Use docker compose up (without --build) if you haven't changed your code and just want to turn the database and Redis back on quickly.


There is only one last, very tiny step before your app is 100% usable.

Step 5: Running Migrations Inside the Container
Right now, your PostgreSQL database inside Docker is brand new, which means it has zero tables. Your Node API is running, but if it tries to fetch a question, it will crash.

We need to run your Prisma migration, but we have to do it inside the running Node container so it can reach the Docker database.

Your Final Task:

Open a second terminal window (leave your first one running so the servers stay on).
Make sure you are in your project folder in this new terminal.
Run this command:
bash
docker compose exec api npx prisma db push
(This tells Docker: "Hey, execute npx prisma db push inside the container named api")

Once Prisma says the database is synced, you are officially finished! Your Fastify backend is now fully Dockerized and you can test it on http://localhost:3000.


We created the tables (with the db push command), but now we need to put the data inside them. You just need to run your seeder inside the Docker container, exactly like we did with the migration!

Your Task: Go to your second terminal window and run your seed script by executing it inside the api container:

bash
docker compose exec api npm run seed:f1
(This tells Docker: "Hey, execute npm run seed:f1 inside the api container")

Once the script finishes running, refresh your browser or Postman and you will see all of your Teams, Matches, and Players instantly appear! Let me know when it populates.



WHY use Docker?
Before Docker, developers had a massive problem known as "But it works on my machine!" You might write code on a Windows computer, and it works perfectly. But when you send it to your friend's Mac, or deploy it to a Linux server, it crashes because they have a different version of Node.js, or they forgot to install PostgreSQL, or they named a file with the wrong capital letter!

Docker solves this by packaging everything.

Consistency: Your app runs exactly the same on your Windows laptop, your friend's MacBook, and a production server.
Easy Setup: If you hire a new developer tomorrow, they don't have to spend 3 hours installing Node, Postgres, and Redis. They just type docker compose up and start coding instantly.
Clean Computer: You don't have to permanently install heavy databases on your personal computer. When you stop the container, it's gone!