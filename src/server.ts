/* eslint-disable @typescript-eslint/no-unused-vars */
import mongoose from 'mongoose'
import config from './app/config'

import app from './app'
import cleanupExpiredSlots from './app/middlewares/cronJobs'

async function main() {
  try {
    await mongoose.connect(config.database_url as string)
    app.listen(config.port, () => {
      console.log(`Example app listening on port ${config.port}`)
    })
    // Start the cleanup job
    cleanupExpiredSlots()
  } catch (err) {
    console.log(err)
  }
}

main()
