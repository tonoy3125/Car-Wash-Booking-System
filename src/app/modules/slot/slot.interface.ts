import { Types } from 'mongoose'

export type TIsBooked = 'available' | 'booked' | 'canceled'

export type TSlot = {
  service: Types.ObjectId
  date: string
  startTime: string
  endTime: string
  isBooked: TIsBooked
}
