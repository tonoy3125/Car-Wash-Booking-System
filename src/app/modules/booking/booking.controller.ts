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
    success: true,
    statusCode: httpStatus.OK,
    message: 'User All Bookings retrieved successfully!',
    data: result,
  })
})

const getUserPendingBooking = catchAsync(async (req, res) => {
  const user = req?.user
  const result = await BookingServices.getUserPendingBookingFromDB(user)
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User Pending Bookings retrieved successfully!',
    data: result,
  })
})

const deleteBooking = catchAsync(async (req, res) => {
  const { id } = req.params
  const result = await BookingServices.deleteBookingFromDB(id)
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Booking deleted Successfully!',
    data: result,
  })
})

export const BookingControllers = {
  createBooking,
  getAllBookings,
  getUserBooking,
  getUserPendingBooking,
  deleteBooking,
}
