import { model, Schema } from 'mongoose'
import { TSlot } from './slot.interface'
import { IsBooked } from './slot.constant'

// Regex for 24-hour time format (HH:mm)
const time24HourRegex = /^([01]\d|2[0-3]):([0-5]\d)$/
// Regex for detecting 12-hour format (AM/PM)
const time12HourRegex = /^(0[1-9]|1[0-2]):([0-5]\d)\s?(AM|PM)$/

const slotSchema = new Schema<TSlot>(
  {
    service: {
      type: Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
      validate: {
        validator: function (v: string) {
          if (time12HourRegex.test(v)) {
            return false // Reject 12-hour format
          }
          return time24HourRegex.test(v) // Accept only 24-hour format
        },
        message: (props) =>
          `${props.value} is not a valid time format! Use HH:mm (24-hour format). Avoid AM/PM.`,
      },
    },
    endTime: {
      type: String,
      required: true,
      validate: {
        validator: function (v: string) {
          if (time12HourRegex.test(v)) {
            return false // Reject 12-hour format
          }
          return time24HourRegex.test(v) // Accept only 24-hour format
        },
        message: (props) =>
          `${props.value} is not a valid time format! Use HH:mm (24-hour format). Avoid AM/PM.`,
      },
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
