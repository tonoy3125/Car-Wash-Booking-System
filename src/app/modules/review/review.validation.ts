import { z } from 'zod'

const createReviewValidationSchema = z.object({
  body: z.object({
    userId: z.string({ required_error: 'User ID is required' }),
    rating: z
      .number({ required_error: 'Rating is required' })
      .min(1, { message: 'Rating must be at least 1 star' })
      .max(5, { message: 'Rating cannot exceed 5 stars' }),
    review: z.string({ required_error: 'Review is required' }),
  }),
})

export const ReviewValidations = {
  createReviewValidationSchema,
}
