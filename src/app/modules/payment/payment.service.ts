/* eslint-disable @typescript-eslint/no-unused-vars */
import { IPayment, IPaymentTokenInfo } from './payment.interface'
import Payment from './payment.model'
import { readFileSync } from 'fs'
import { join } from 'path'
import jwt from 'jsonwebtoken'
import { Booking } from '../booking/booking.model'

const createPaymentIntoDB = async (paymentData: IPayment) => {
  const payment = new Payment(paymentData)
  return await payment.save()
}

const successPayment = async (paymentInfoToken: string) => {
  // Decode the payment information token
  const decode = jwt.verify(
    paymentInfoToken,
    process.env.SIGNATURE_KEY as string,
  ) as IPaymentTokenInfo

  // console.log('Decoded JWT:', decode)

  const { transactionId, amount, customer } = decode // Ensure `userId` is included in the token
  // console.log('User ID:', customer)

  if (!customer) {
    throw new Error('User ID is required to update bookings')
  }

  // Update all bookings associated with the user
  const bookingsUpdate = await Booking.updateMany(
    { customer }, // Match all bookings for this user
    { payment: 'Paid' }, // Set payment status to 'Paid'
    { new: true }, // Return updated documents
  )

  if (bookingsUpdate.modifiedCount === 0) {
    throw new Error('No bookings found or update failed for the user')
  }

  // console.log('Updated bookings:', bookingsUpdate)

  // Update the payment status to 'Paid'
  const paymentUpdate = await Payment.findOneAndUpdate(
    { transactionId }, // Filter by transaction ID
    { status: 'Paid' }, // Set the status to 'Paid'
    { new: true }, // Return the updated document
  )

  if (!paymentUpdate) {
    throw new Error('Payment not found or update failed')
  }

  // console.log('Updated payment:', paymentUpdate)

  // Correctly process the email template
  const filePath = join(__dirname, '../../templates/success.html')
  const template = readFileSync(filePath, 'utf-8')
  const successTemplate = template.replace('{{link}}', 'https://aqua-auto-car-wash-booking-system-frontend.vercel.app/')

  // Return the updated information along with the processed email template
  return {
    bookings: bookingsUpdate,
    payment: paymentUpdate,
    successTemplate,
    transactionId,
    amount,
  }
}

const errorPayment = async (paymentInfoToken: string) => {
  // Decode the payment information token
  const decode = jwt.verify(
    paymentInfoToken,
    process.env.SIGNATURE_KEY as string,
  ) as IPaymentTokenInfo

  // Correctly process the email template
  const filePath = join(__dirname, '../../templates/error.html')
  const template = readFileSync(filePath, 'utf-8')
  const errorTemplate = template.replace(
    '{{link}}',
    'https://aqua-auto-car-wash-booking-system-frontend.vercel.app/booking',
  )

  // Return the updated information along with the processed email template
  return {
    errorTemplate,
  }
}

export const PaymentServices = {
  createPaymentIntoDB,
  successPayment,
  errorPayment,
}
