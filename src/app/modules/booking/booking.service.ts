import { JwtPayload } from 'jsonwebtoken'
import { TBookingForReq } from './booking.interface'
import { User } from '../user/user.model'
import { AppError } from '../../errors/AppError'
import httpStatus from 'http-status'
import { Service } from '../service/service.model'
import { Slot } from '../slot/slot.model'
import { Booking } from './booking.model'
import QueryBuilder from '../../builder/QueryBuilder'
import { bookingSearchableField } from './booking.constant'

const createBookingInDB = async (payload: TBookingForReq, user: JwtPayload) => {
  const userData = await User.findOne({ email: user?.email, role: user?.role })
  if (!userData) {
    throw new AppError(httpStatus.NOT_FOUND, 'Customer does not exists')
  }

  const serviceData = await Service.findById(payload?.serviceId)

  if (!serviceData) {
    throw new AppError(httpStatus.NOT_FOUND, 'Service does not exists')
  }
  const slotData = await Slot.findOne({
    _id: payload?.slotId,
    service: payload?.serviceId,
  })

  if (!slotData) {
    throw new AppError(httpStatus.NOT_FOUND, 'Slot does not exists')
  }
  if (slotData?.isBooked === 'booked') {
    throw new AppError(httpStatus.BAD_REQUEST, 'This slot is already booked')
  }
  await Slot.findByIdAndUpdate(payload?.slotId, {
    isBooked: 'booked',
  })

  const booking = await Booking.create({
    customer: userData?._id,
    service: payload?.serviceId,
    slot: payload?.slotId,
    vehicleType: payload?.vehicleType,
    vehicleBrand: payload?.vehicleBrand,
    vehicleModel: payload?.vehicleModel,
    manufacturingYear: payload?.manufacturingYear,
    registrationPlate: payload?.registrationPlate,
  })

  const result = await Booking.findById(booking?._id)
    .populate('customer')
    .populate('service')
    .populate('slot')
  return result
}

const getAllBookingsFromDB = async (query: Record<string, unknown>) => {
  const bookingQuery = new QueryBuilder(
    Booking.find().populate('customer').populate('service').populate('slot'),
    query,
  )
    .search(bookingSearchableField)
    .filter()
    .sort()
    .paginate()
    .fields()

  // const result = await Service.find()
  // return result

  const meta = await bookingQuery.countTotal()
  const result = await bookingQuery.modelQuery

  return {
    meta,
    result,
  }
}

const getUserBookingFromDB = async (user: JwtPayload) => {
  const userData = await User.findOne({ email: user?.email, role: user?.role })
  const result = await Booking.find({ customer: userData?._id })
    .populate('service')
    .populate('slot')
  return result
}

export const BookingServices = {
  createBookingInDB,
  getAllBookingsFromDB,
  getUserBookingFromDB,
}
