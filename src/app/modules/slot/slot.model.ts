import { model, Schema } from 'mongoose'
import { TSlot } from './slot.interface'
import { IsBooked } from './slot.constant'

const slotSchema = new Schema<TSlot>(
  {
    service: {
      type: Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    isBooked: {
      type: String,
      enum: IsBooked,
      default: 'available',
    },
  },
  {
    timestamps: true,
  },
)

export const Slot = model<TSlot>('Slot', slotSchema)
