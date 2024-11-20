import { JwtPayload } from 'jsonwebtoken'
import { TBookingForReq } from './booking.interface'
import { User } from '../user/user.model'
import { AppError } from '../../errors/AppError'
import httpStatus from 'http-status'
import { Service } from '../service/service.model'
import { Slot } from '../slot/slot.model'
import { Booking } from './booking.model'
import QueryBuilder from '../../builder/QueryBuilder'

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
  const searchTerm = query?.searchTerm as string

  let customerIds: string[] = []
  let serviceIds: string[] = []

  // Search in related collections
  if (searchTerm) {
    // Find matching customers by name
    const matchingCustomers = await User.find({
      name: { $regex: searchTerm, $options: 'i' },
    }).select('_id')

    // Find matching services by name
    const matchingServices = await Service.find({
      name: { $regex: searchTerm, $options: 'i' },
    }).select('_id')

    customerIds = matchingCustomers.map((customer) => customer._id.toString())
    serviceIds = matchingServices.map((service) => service._id.toString())
  }

  // Create the main query
  const baseQuery = Booking.find()

  if (searchTerm) {
    baseQuery.where({
      $or: [
        { customer: { $in: customerIds } },
        { service: { $in: serviceIds } },
      ],
    })
  }

  const bookingQuery = new QueryBuilder(
    baseQuery.populate('customer').populate('service').populate('slot'),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields()

  // Fetch metadata and result
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

const deleteBookingFromDB = async (id: string) => {
  const booking = await Booking.findById(id)

  if (!booking) {
    throw new AppError(httpStatus.NOT_FOUND, 'Booking Not Found by this ID')
  }

  const result = await Booking.findByIdAndDelete(id)
  return result
}

export const BookingServices = {
  createBookingInDB,
  getAllBookingsFromDB,
  getUserBookingFromDB,
  deleteBookingFromDB,
}
