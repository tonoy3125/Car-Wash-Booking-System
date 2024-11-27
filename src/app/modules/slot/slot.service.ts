import httpStatus from 'http-status'
import { AppError } from '../../errors/AppError'
import { Service } from '../service/service.model'
import { TIsBooked, TSlot } from './slot.interface'
import { Slot } from './slot.model'
import QueryBuilder from '../../builder/QueryBuilder'

const createSlotIntoDB = async (payload: TSlot) => {
  // Check if the service exists by this ID
  const service = await Service.findById(payload?.service)

  if (!service) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Service does not exist by this ID',
    )
  }

  // Extract service duration and unit (e.g., "minutes" or "hours")
  let serviceDuration = service.duration // e.g., 30, 1
  const serviceDurationUnit = service.durationUnit // e.g., "minutes" or "hours"

  // Convert service duration to minutes based on the unit
  if (serviceDurationUnit === 'Hours') {
    serviceDuration *= 60 // Convert hours to minutes
  } else if (serviceDurationUnit !== 'Minutes') {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid service duration unit')
  }

  // Helper function to convert 12-hour time format with AM/PM to minutes from midnight
  const convertTimeToMinutes = (time: string): number => {
    const [hourMinute, period] = time.split(' ') // Split time and AM/PM
    const [hours, minutes] = hourMinute.split(':').map(Number)
    const isPM = period.toUpperCase() === 'PM'
    const hourIn24 = (hours % 12) + (isPM ? 12 : 0) // Convert to 24-hour format
    return hourIn24 * 60 + minutes
  }

  // Helper function to convert minutes from midnight to 12-hour time format with AM/PM
  const convertMinutesToTime = (minutes: number): string => {
    const hours24 = Math.floor(minutes / 60)
    const minutesLeft = minutes % 60
    const isPM = hours24 >= 12
    const hours12 = hours24 % 12 || 12 // Convert 0 to 12 for 12-hour format
    const period = isPM ? 'PM' : 'AM'
    return `${hours12.toString().padStart(2, '0')}:${minutesLeft
      .toString()
      .padStart(2, '0')} ${period}`
  }

  // Extract start time and end time from payload
  const startTimeString = payload?.startTime // e.g., "09:00 AM"
  const endTimeString = payload?.endTime // e.g., "02:00 PM"

  // Convert times to total minutes from midnight
  const startTimeInMins = convertTimeToMinutes(startTimeString)
  const endTimeInMins = convertTimeToMinutes(endTimeString)

  // Calculate total duration in minutes
  const totalDuration = endTimeInMins - startTimeInMins

  if (totalDuration <= 0 || totalDuration < serviceDuration) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Invalid time range or insufficient duration for at least one slot',
    )
  }

  // Generate slot intervals dynamically
  const timeIntervals: { startTime: string; endTime: string }[] = []
  let currentStartTimeInMins = startTimeInMins

  while (currentStartTimeInMins + serviceDuration <= endTimeInMins) {
    const intervalStartMins = currentStartTimeInMins
    const intervalEndMins = intervalStartMins + serviceDuration

    const startTime = convertMinutesToTime(intervalStartMins)
    const endTime = convertMinutesToTime(intervalEndMins)

    timeIntervals.push({ startTime, endTime })

    // Move to the next slot
    currentStartTimeInMins += serviceDuration
  }

  // Create slots for the database
  const slots = timeIntervals.map((time) => ({
    service: payload?.service,
    date: payload?.date, // Assuming the date is provided in the payload
    startTime: time.startTime,
    endTime: time.endTime,
  }))

  // Save slots to the database
  const result = await Slot.create(slots)
  return result
}

const getAvailableSlotsFromDB = async (query: Record<string, unknown>) => {
  const slotQuery = new QueryBuilder(Slot.find().populate('service'), query)
    // .search(serviceSearchableField)
    .filter()
    .sort()
    .paginate()
    .fields()

  const meta = await slotQuery.countTotal()
  const result = await slotQuery.modelQuery.exec()
  console.log('slot result', result)

  return {
    meta,
    result,
  }
}

const getSlotsByServiceFromDB = async (
  serviceId: string,
  query: Record<string, unknown>,
) => {
  // Initialize QueryBuilder
  const queryBuilder = new QueryBuilder(
    Slot.find({
      service: serviceId,
      isBooked: { $in: ['available', 'canceled'] },
    }),
    query,
  )

  // Apply additional filter for isBooked status to only include 'available' or 'canceled' slots
  // Apply filters, including startTime and endTime
  queryBuilder.filter()

  queryBuilder.modelQuery.sort({ startTime: 1 })

  // Populate related fields and execute the query
  const slots = await queryBuilder.modelQuery.populate('service').exec()

  if (!slots || slots.length === 0) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'No slots found for this service ID',
    )
  }

  return slots
}

const updateSlotStatusInDB = async (id: string, newIsBooked: TIsBooked) => {
  const validStatus = ['available', 'canceled'] // Admin can only toggle these states

  if (!validStatus.includes(newIsBooked)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Invalid slot status for admin update',
    )
  }

  const slot = await Slot.findById(id)

  if (!slot) {
    throw new AppError(httpStatus.NOT_FOUND, 'Slot not found')
  }

  // Prevent updates to 'booked' slots
  if (slot.isBooked === 'booked') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Cannot update the status of a booked slot',
    )
  }

  // Update status
  slot.isBooked = newIsBooked
  const updatedSlot = await slot.save()

  return updatedSlot
}

const deleteSlotFromDB = async (id: string) => {
  const slot = await Slot.findById(id)

  if (!slot) {
    throw new AppError(httpStatus.NOT_FOUND, 'Slot Not Found by this ID')
  }

  const result = await Slot.findByIdAndDelete(id)
  return result
}

export const SlotServices = {
  createSlotIntoDB,
  getAvailableSlotsFromDB,
  getSlotsByServiceFromDB,
  updateSlotStatusInDB,
  deleteSlotFromDB,
}
