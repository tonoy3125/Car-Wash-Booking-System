import { model, Schema } from 'mongoose'
import { TReview } from './review.interface'

const ReviewSchema = new Schema<TReview>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    review: {
      type: String,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
)

export const Review = model<TReview>('Review', ReviewSchema)
