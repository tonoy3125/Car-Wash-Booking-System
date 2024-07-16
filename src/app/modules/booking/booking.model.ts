import { model, Schema } from 'mongoose'
import { vehicleTypes } from './booking.constant'
import { TBooking } from './booking.interface'

const bookingSchema = new Schema(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    service: {
      type: Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    slot: {
      type: Schema.Types.ObjectId,
      ref: 'Slot',
      required: true,
    },
    vehicleType: {
      type: String,
      enum: vehicleTypes,
      required: true,
    },
    vehicleBrand: {
      type: String,
      required: true,
    },
    vehicleModel: {
      type: String,
      required: true,
    },
    manufacturingYear: {
      type: Number,
      required: true,
    },
    registrationPlate: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
)

export const Booking = model<TBooking>('Booking', bookingSchema)
