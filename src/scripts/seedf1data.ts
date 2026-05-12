import { seedF1DataService } from './seed.service.ts'

async function run() {   // run the seed service
  const result = await seedF1DataService()  // seed the f1 data
  console.log('Seed completed:', result)  // log the result
}

run()  // run the run function

// npm run seed:f1