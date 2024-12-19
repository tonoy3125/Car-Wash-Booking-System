import express from 'express'
import { ReviewControllers } from './review.controller'
import validateRequest from '../../middlewares/validateRequest'
import { ReviewValidations } from './review.validation'
import auth from '../../middlewares/auth'

const router = express.Router()

router.post(
  '/',
  validateRequest(ReviewValidations.createReviewValidationSchema),
  ReviewControllers.createReview,
)

router.get('/', auth('admin', 'user'), ReviewControllers.getAllReviews)

export const ReviewRoutes = router
