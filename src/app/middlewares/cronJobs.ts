import cron from 'node-cron'
import { Slot } from '../modules/slot/slot.model'

const cleanupExpiredSlots = () => {
  // Schedule a job to run daily at midnight
  cron.schedule('* * * * * *', async () => {
    // console.log('Running daily cleanup task for expired slots...')
    try {
      const today = new Date().toISOString().split('T')[0] // Get today's date (YYYY-MM-DD)

      // Delete slots with isBooked "available" or "canceled" and date before today
      const result = await Slot.deleteMany({
        date: { $lt: today },
        isBooked: { $in: ['available', 'canceled'] },
      })
    } catch (error) {
      console.error('Error during slot cleanup:', error)
    }
  })
}

export default cleanupExpiredSlots
