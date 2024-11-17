import httpStatus from 'http-status'
import { AppError } from '../../errors/AppError'
import { Service } from '../service/service.model'
import { TSlot } from './slot.interface'
import { Slot } from './slot.model'

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

  // Extract start time and end time from payload
  const startTimeString = payload?.startTime // e.g., "09:00"
  const endTimeString = payload?.endTime // e.g., "14:00"

  // Convert times to total minutes from midnight
  const startTimeInMins =
    Number(startTimeString.split(':')[0]) * 60 +
    Number(startTimeString.split(':')[1])

  const endTimeInMins =
    Number(endTimeString.split(':')[0]) * 60 +
    Number(endTimeString.split(':')[1])

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

    const startTime = `${Math.floor(intervalStartMins / 60)
      .toString()
      .padStart(2, '0')}:${(intervalStartMins % 60)
      .toString()
      .padStart(2, '0')}`
    const endTime = `${Math.floor(intervalEndMins / 60)
      .toString()
      .padStart(2, '0')}:${(intervalEndMins % 60).toString().padStart(2, '0')}`

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
  const queryObj: Partial<{ service: string; date: string }> = {}
  //   console.log(queryObj)
  if (query?.date) {
    queryObj.date = query.date as string
  }

  if (query?.serviceId) {
    queryObj.service = query.serviceId as string
  }

  const result = await Slot.find(queryObj).populate('service')
  //   console.log(result)

  return result
}

export const SlotServices = {
  createSlotIntoDB,
  getAvailableSlotsFromDB,
}
