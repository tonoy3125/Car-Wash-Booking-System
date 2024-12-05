import express from 'express'
import { PaymentControllers } from './payment.controller'
import auth from '../../middlewares/auth'

const router = express.Router()

router.post(
  '/create-intent',
  auth('admin', 'user'),
  PaymentControllers.createPayment,
)

router.post(
  '/success',
  //   auth('admin', 'user'),
  PaymentControllers.successPaymentController,
)

export const PaymentRoutes = router
