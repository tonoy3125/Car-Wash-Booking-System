/* eslint-disable @typescript-eslint/no-unused-vars */
import { JwtPayload } from 'jsonwebtoken'
import { TBookingForReq } from './booking.interface'
import { User } from '../user/user.model'
import { AppError } from '../../errors/AppError'
import httpStatus from 'http-status'
import { Service } from '../service/service.model'
import { Slot } from '../slot/slot.model'
import { Booking } from './booking.model'
import QueryBuilder from '../../builder/QueryBuilder'
import { PipelineStage } from 'mongoose'

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

const getUserPendingBookingFromDB = async (user: JwtPayload) => {
  const userData = await User.findOne({ email: user?.email, role: user?.role })

  // Make sure that user data is found before proceeding
  if (!userData) {
    throw new Error('User not found')
  }

  const result = await Booking.find({
    customer: userData._id,
    payment: 'Pending', // Assuming 'Pending' is the status for payment pending
  })
    .populate('service')
    .populate('slot')

  return result
}

const getUserPastBookingFromDB = async (
  user: JwtPayload,
  query: Record<string, unknown>,
) => {
  const userData = await User.findOne({ email: user?.email, role: user?.role })

  // Ensure user data exists
  if (!userData) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found')
  }

  // Get the start of today in UTC
  const now = new Date()
  const timezoneOffset = 6 * 60 // Asia/Dhaka is UTC +6

  // Adjust the current time to Asia/Dhaka
  const nowLocalTime = new Date(now.getTime() + timezoneOffset * 60 * 1000)

  // Combine slot.date and slot.startTime into a Date object to get the full datetime
  const convertSlotToDate = (slotDate: Date, startTime: string): Date => {
    const slotTimeParts = startTime.split(':')
    const slotHours = parseInt(slotTimeParts[0], 10)
    const slotMinutes = parseInt(slotTimeParts[1], 10)

    const newSlotDate = new Date(slotDate)
    newSlotDate.setHours(slotHours, slotMinutes, 0, 0) // Set time from startTime
    return newSlotDate
  }

  // Base aggregation pipeline
  const pipeline: PipelineStage[] = [
    { $match: { customer: userData._id, payment: 'Paid' } },
    {
      $lookup: {
        from: 'slots',
        localField: 'slot',
        foreignField: '_id',
        as: 'slot',
      },
    },
    { $unwind: '$slot' },
    {
      $addFields: {
        slotDateTime: {
          $let: {
            vars: {
              slotDate: '$slot.date',
              startTime: '$slot.startTime',
            },
            in: {
              $toDate: {
                $concat: [
                  { $dateToString: { format: '%Y-%m-%d', date: '$$slotDate' } },
                  ' ',
                  '$$startTime',
                ],
              },
            },
          },
        },
      },
    },
    // Match past bookings where the combined date and time is in the past
    { $match: { slotDateTime: { $lt: nowLocalTime } } },
    {
      $lookup: {
        from: 'services',
        localField: 'service',
        foreignField: '_id',
        as: 'service',
      },
    },
    { $unwind: '$service' },
  ]

  // Pagination setup
  const page = parseInt(query.page as string, 10) || 1 // Default to page 1
  const limit = parseInt(query.limit as string, 10) || 10 // Default to 10 items per page
  const skip = (page - 1) * limit

  // Apply sorting
  if (query.sort && typeof query.sort === 'string') {
    try {
      const sort = JSON.parse(query.sort) as Record<string, 1 | -1>
      pipeline.push({ $sort: sort })
    } catch (error) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Invalid sort parameter')
    }
  }

  // Apply field projection
  if (query.fields && typeof query.fields === 'string') {
    try {
      const fields = JSON.parse(query.fields) as Record<string, 1>
      pipeline.push({ $project: fields })
    } catch (error) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Invalid fields parameter')
    }
  }

  // Count total records for pagination
  const totalDocuments = await Booking.aggregate([
    { $match: { customer: userData._id, payment: 'Paid' } },
    {
      $lookup: {
        from: 'slots',
        localField: 'slot',
        foreignField: '_id',
        as: 'slot',
      },
    },
    { $unwind: '$slot' },
    {
      $addFields: {
        slotDateTime: {
          $let: {
            vars: {
              slotDate: '$slot.date',
              startTime: '$slot.startTime',
            },
            in: {
              $toDate: {
                $concat: [
                  { $dateToString: { format: '%Y-%m-%d', date: '$$slotDate' } },
                  ' ',
                  '$$startTime',
                ],
              },
            },
          },
        },
      },
    },
    { $match: { slotDateTime: { $lt: nowLocalTime } } },
  ]).count('count')

  // Calculate total pages
  const totalPage = Math.ceil((totalDocuments[0]?.count || 0) / limit)

  // Add pagination stages to the pipeline
  pipeline.push({ $skip: skip }, { $limit: limit })

  // Run the pipeline to get the paginated results
  const result = await Booking.aggregate(pipeline)

  return {
    meta: {
      page,
      limit,
      total: totalDocuments[0]?.count || 0,
      totalPage,
    },
    result,
  }
}

const getUserUpcomingBookingFromDB = async (user: JwtPayload) => {
  const userData = await User.findOne({ email: user?.email, role: user?.role })

  // Ensure user exists
  if (!userData) {
    throw new Error('User not found')
  }

  // Get the current date and time in Bangladesh time (Asia/Dhaka timezone)
  // Get the current UTC time
  const now = new Date()
  const timezoneOffset = 6 * 60 // Asia/Dhaka is UTC +6

  // Adjust the current time to Asia/Dhaka
  const nowLocalTime = new Date(now.getTime() + timezoneOffset * 60 * 1000)

  // console.log(nowLocalTime)

  // Aggregation pipeline
  const upcomingBookings = await Booking.aggregate([
    // Match bookings for the user and payment status 'Paid'
    {
      $match: {
        customer: userData._id,
        payment: 'Paid',
      },
    },
    // Lookup the customer details (populate customer)
    {
      $lookup: {
        from: 'users', // The name of the users collection
        localField: 'customer', // The field in Booking collection
        foreignField: '_id', // The field in User collection
        as: 'customerDetails',
      },
    },
    // Unwind the customerDetails array
    {
      $unwind: {
        path: '$customerDetails',
        preserveNullAndEmptyArrays: false, // Exclude documents with no customerDetails
      },
    },
    // Lookup the slot details (populate slot)
    {
      $lookup: {
        from: 'slots', // The name of the slots collection
        localField: 'slot', // The field in Booking collection
        foreignField: '_id', // The field in Slot collection
        as: 'slotDetails',
      },
    },
    // Unwind the slotDetails array
    {
      $unwind: {
        path: '$slotDetails',
        preserveNullAndEmptyArrays: false,
      },
    },
    // Add fields to convert slot date and time to local time
    {
      $addFields: {
        slotDetailsStartTime: {
          $let: {
            vars: {
              startTimeStr: {
                $concat: [
                  { $substr: [{ $toString: '$slotDetails.date' }, 0, 10] }, // Date from slot
                  ' ',
                  '$slotDetails.startTime', // Add the start time
                ],
              },
            },
            in: { $toDate: '$$startTimeStr' }, // Convert to Date object
          },
        },
        slotDetailsStartTimeLocal: {
          $let: {
            vars: {
              startTimeStr: {
                $concat: [
                  { $substr: [{ $toString: '$slotDetails.date' }, 0, 10] },
                  ' ',
                  '$slotDetails.startTime',
                ],
              },
            },
            in: {
              $toDate: {
                $dateToString: {
                  format: '%Y-%m-%dT%H:%M:%S',
                  date: { $toDate: '$$startTimeStr' },
                },
              },
            },
          },
        },
      },
    },
    // Match slots that are still upcoming (current time is before slot start time)
    {
      $match: {
        $expr: {
          $and: [
            { $gte: ['$slotDetailsStartTimeLocal', nowLocalTime] }, // Compare to local time
          ],
        },
      },
    },
    // Lookup the service details
    {
      $lookup: {
        from: 'services', // The name of the service collection
        localField: 'service',
        foreignField: '_id',
        as: 'serviceDetails',
      },
    },
    // Format the output (optional)
    {
      $project: {
        _id: 1,
        customer: '$customerDetails', // Populate customer
        payment: 1,
        slot: '$slotDetails', // Populate slot
        service: { $arrayElemAt: ['$serviceDetails', 0] }, // Flatten the serviceDetails array
      },
    },
  ])

  return upcomingBookings
}

const deleteBookingFromDB = async (id: string) => {
  const booking = await Booking.findById(id)

  if (!booking) {
    throw new AppError(httpStatus.NOT_FOUND, 'Booking Not Found by this ID')
  }

  const result = await Booking.findByIdAndDelete(id)
  return result
}

const deleteUserBookingFromDB = async (id: string) => {
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
  getUserPendingBookingFromDB,
  getUserPastBookingFromDB,
  getUserUpcomingBookingFromDB,
  deleteBookingFromDB,
  deleteUserBookingFromDB,
}
