import QueryBuilder from '../../builder/QueryBuilder'
import { TReview } from './review.interface'
import { Review } from './review.model'

const createReviewIntoDB = async (payload: TReview) => {
  const result = await Review.create(payload)
  return result
}

const getAllReviewsFromDB = async (query: Record<string, unknown>) => {
  const reviewQuery = new QueryBuilder(Review.find().populate('userId'), query)
    .filter()
    .sort()
    .paginate()
    .fields()

  const meta = await reviewQuery.countTotal()
  const result = await reviewQuery.modelQuery
  return { meta, result }
}

export const ReviewServices = {
  createReviewIntoDB,
  getAllReviewsFromDB,
}
