import { Types } from 'mongoose'

export type TReview = {
  userId: Types.ObjectId
  rating: 1 | 2 | 3 | 4 | 5
  review: string
  isDeleted: boolean
}
