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

router.get('/', auth(USER_ROLE.admin), BookingControllers.getAllBookings)

router.delete('/:id', auth(USER_ROLE.admin), BookingControllers.deleteBooking)

const router2 = express.Router()

router2.get('/', auth(USER_ROLE.user), BookingControllers.getUserBooking)
router2.get(
  '/pending',
  auth(USER_ROLE.user),
  BookingControllers.getUserPendingBooking,
)

router2.get(
  '/my-past-bookings',
  auth(USER_ROLE.user),
  BookingControllers.getUserPastBooking,
)

export const BookingRoutes = router
export const BookingRoutes2 = router2
