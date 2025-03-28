import express from 'express'
import { ReviewControllers } from './review.controller'
import validateRequest from '../../middlewares/validateRequest'
import { ReviewValidations } from './review.validation'

const router = express.Router()

router.post(
  '/',
  validateRequest(ReviewValidations.createReviewValidationSchema),
  ReviewControllers.createReview,
)

router.get('/', ReviewControllers.getAllReviews)

export const ReviewRoutes = router
