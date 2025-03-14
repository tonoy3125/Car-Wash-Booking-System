/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { initiatePayment } from './payment.utils'
import { PaymentServices } from './payment.service'
import { User } from '../user/user.model'

const createPayment = catchAsync(async (req, res) => {
  const { bookingIds, customerId, amount } = req.body

  // Validate required fields
  if (!bookingIds || !Array.isArray(bookingIds) || !customerId || !amount) {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus.BAD_REQUEST,
      message:
        'Missing or invalid required fields: bookingIds, customerId, amount',
      data: null,
    })
  }

  // Fetch user details
  const user = await User.findById(customerId)
  if (!user) {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus.NOT_FOUND,
      message: 'Customer not found',
      data: null,
    })
  }

  const {
    name: cus_name,
    phone: cus_phone,
    email: cus_email,
    address: cus_add,
    id: customer,
  } = user

  // Generate a unique transaction ID
  const transactionId = `TRAN_${Date.now()}`

  // Call payment gateway or mock payment initiation logic
  const paymentResponse = await initiatePayment({
    amount,
    tran_id: transactionId,
    cus_name,
    cus_phone,
    cus_email,
    cus_add,
    customer,
  })

  if (paymentResponse?.payment_url) {
    // Create payment in the database
    const paymentData = {
      customer: customerId,
      booking: bookingIds, // Store all booking IDs together
      amount,
      transactionId,
    }

    const payment = await PaymentServices.createPaymentIntoDB(paymentData)

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Payment initiated successfully!',
      data: {
        paymentUrl: paymentResponse.payment_url,
        transactionId,
        payment,
      },
    })
  } else {
    sendResponse(res, {
      success: false,
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: 'Failed to initiate payment. Please try again.',
      data: null,
    })
  }
})

const successPaymentController = catchAsync(async (req, res) => {
  const paymentInfoToken = req.query.pt as string
  // console.log('Payment Info Token:', req.query.pt)

  try {
    const result = await PaymentServices.successPayment(paymentInfoToken)

    res.status(httpStatus.OK).send(result.successTemplate)
  } catch (error: any) {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message,
      data: error,
    })
  }
})

const failPaymentController = catchAsync(async (req, res) => {
  const paymentInfoToken = req.query.pt as string
  // console.log('Payment Info Token:', req.query.pt)

  try {
    const result = await PaymentServices.errorPayment(paymentInfoToken)

    res.status(httpStatus.OK).send(result.errorTemplate)
  } catch (error) {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: 'An error occurred while processing payment',
      data: null,
    })
  }
})

export const PaymentControllers = {
  createPayment,
  successPaymentController,
  failPaymentController,
}
