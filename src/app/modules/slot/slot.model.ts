import { model, Schema } from 'mongoose'
import { TSlot } from './slot.interface'
import { IsBooked } from './slot.constant'

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
          return time12HourRegex.test(v)
        },
        message: (props) =>
          `${props.value} is not a valid time format! Use hh:mm AM/PM.`,
      },
    },
    endTime: {
      type: String,
      required: true,
      validate: {
        validator: function (v: string) {
          return time12HourRegex.test(v)
        },
        message: (props) =>
          `${props.value} is not a valid time format! Use hh:mm AM/PM.`,
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

// slotSchema.pre('find', function (next) {
//   this.find({ isBooked: { $ne: 'booked' } })
//   next()
// })

export const Slot = model<TSlot>('Slot', slotSchema)
