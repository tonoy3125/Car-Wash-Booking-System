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

const getAllBookings = catchAsync(async (req, res) => {
  const result = await BookingServices.getAllBookingsFromDB(req?.query)
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'All bookings retrieved Successfully!',
    meta: result.meta,
    data: result.result,
  })
})

const getUserBooking = catchAsync(async (req, res) => {
  const user = req?.user
  const result = await BookingServices.getUserBookingFromDB(user)
  sendResponse(res, {
    success: result.length ? true : false,
    statusCode: result.length ? httpStatus.OK : httpStatus.NOT_FOUND,
    message: result.length
      ? 'User bookings retrieved successfully'
      : 'No Data Found',
    data: result,
  })
})

export const BookingControllers = {
  createBooking,
  getAllBookings,
  getUserBooking,
}
