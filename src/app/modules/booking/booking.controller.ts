import httpStatus from 'http-status'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { BookingServices } from './booking.service'

const createBooking = catchAsync(async (req, res) => {
  const user = req.user
//   console.log(user)
  const result = await BookingServices.createBookingInDB(req.body, user)
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Booking successfull',
    data: result,
  })
})

export const BookingControllers = {
  createBooking,
}
