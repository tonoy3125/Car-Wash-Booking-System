import httpStatus from 'http-status'
import { AppError } from '../../errors/AppError'
import { Service } from '../service/service.model'
import { TSlot } from './slot.interface'
import { Slot } from './slot.model'

const createSlotIntoDB = async (payload: TSlot) => {
  // check if Service does not exists by this id
  const service = await Service.findById(payload?.service)

  if (!service) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Service does not exists by this id',
    )
  }

  //   Calculation
  const serviceDuration = service?.duration
  const startTimeString = payload?.startTime
  const endTimeString = payload?.endTime

  const startTimeInMins =
    Number(startTimeString.split(':')[0]) * serviceDuration

  const endTimeInMins = Number(endTimeString.split(':')[0]) * serviceDuration

  //   console.log(startTimeInMins, endTimeInMins)

  const totalDuration = endTimeInMins - startTimeInMins

  const numberOfSlots = totalDuration / serviceDuration

  // generate slots

  const timeIntervals: { startTime: string; endTime: string }[] = []
  for (let i = 0; i < numberOfSlots; i++) {
    const startTime =
      (Number(startTimeString.split(':')[0]) + i).toString() + ':00'
    const endTime =
      (
        Number(endTimeString.split(':')[0]) -
        (numberOfSlots - 1) +
        i
      ).toString() + ':00'

    timeIntervals.push({ startTime, endTime })
  }

  const slots = timeIntervals.map((time) => {
    return {
      service: payload?.service,
      date: payload?.date,
      startTime: time.startTime,
      endTime: time.endTime,
    }
  })

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

  const result = await Slot.find(queryObj)
//   console.log(result)

  return result
}

export const SlotServices = {
  createSlotIntoDB,
  getAvailableSlotsFromDB,
}
