import express from 'express'
import { PaymentControllers } from './payment.controller'
import auth from '../../middlewares/auth'

const router = express.Router()

router.post(
  '/create-intent',
  auth('admin', 'user'),
  PaymentControllers.createPayment,
)

export const PaymentRoutes = router
