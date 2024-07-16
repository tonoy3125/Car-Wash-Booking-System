import httpStatus from 'http-status'
import { AppError } from '../../errors/AppError'
import { Service } from '../service/service.model'
import { TSlot } from './slot.interface'
import { Slot } from './slot.model'

const createSlotIntoDB = async (payload: TSlot) => {
  const service = await Service.findById(payload?.service)

  if (!service) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Service does not exists by this id',
    )
  }

  const result = await Slot.create(payload)
  return result
}

export const SlotServices = {
  createSlotIntoDB,
}
