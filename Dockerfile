# 1. Start with a lightweight Node.js environment
FROM node:20-alpine    

# FROM tells Docker which base image to start with
# node:20 is the version of Node.js we are using
# alpine is a lightweight Linux distribution that is used as the base image

# 2. Set the working directory INSIDE the container
WORKDIR /app

# WORKDIR sets the working directory INSIDE the container
# /app is the path inside the container where our application code will live

# 3. Copy only the package files first (Docker caches this step to make future builds faster)
COPY package*.json ./

# 4. Install your project dependencies
RUN npm install

# 5. Copy the Prisma folder and generate the database client
COPY prisma ./prisma/
RUN npx prisma generate

# 6. Copy the rest of your application code
COPY . .

# 7. Build the TypeScript code (based on your package.json scripts)
RUN npm run build

# 8. Expose the port your Fastify app runs on (assuming it's 3000)
EXPOSE 3000

# EXPOSE tells Docker which port the application inside the container will listen on
# This is just documentation; it does not actually publish the port

# 9. The command to run when the container starts
CMD ["npm", "start"]

