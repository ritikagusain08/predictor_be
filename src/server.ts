import { buildApp } from './app.ts'
import { env } from './config/env.ts'

async function start() {   // server startup function
  const app = await buildApp()

  try {
    await app.listen({ port: env.PORT, host: env.HOST })   //starts the backend server
    console.log(`Swagger UI: http://${env.HOST === '0.0.0.0' ? 'localhost' : env.HOST}:${env.PORT}/docs`)
                     //Prints Swagger URL in console
  } catch (err) {
    app.log.error(err)
    process.exit(1)  // process exits with a failure code
  }
}

start()
