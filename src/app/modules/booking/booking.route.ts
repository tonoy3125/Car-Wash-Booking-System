import express from 'express'
import { BookingControllers } from './booking.controller'
import validateRequest from '../../middlewares/validateRequest'
import { BookingValidations } from './booking.validation'
import auth from '../../middlewares/auth'
import { USER_ROLE } from '../user/user.constant'

const router = express.Router()

router.post(
  '/',
  auth(USER_ROLE.user),
  validateRequest(BookingValidations.createBookingValidationSchema),
  BookingControllers.createBooking,
)

export const BookingRoutes = router
