import express from 'express'
import { PaymentControllers } from './payment.controller'

const router = express.Router()

router.post(
  '/create-intent',
  // auth('admin', 'user'),
  PaymentControllers.createPayment,
)

router.post(
  '/success',
  //   auth('admin', 'user'),
  PaymentControllers.successPaymentController,
)

router.post('/fail', PaymentControllers.failPaymentController)

export const PaymentRoutes = router
