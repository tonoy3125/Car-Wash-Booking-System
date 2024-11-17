import { model, Schema } from 'mongoose'
import { TService } from './service.interface'
import { TDurationUnitTypes } from './service.constant'

const serviceSchema = new Schema<TService>(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    durationUnit: {
      type: String,
      required: true,
      enum: TDurationUnitTypes,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
)

export const Service = model<TService>('Service', serviceSchema)
