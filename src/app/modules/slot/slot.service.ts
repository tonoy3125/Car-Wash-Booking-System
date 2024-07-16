import { TSlot } from './slot.interface'
import { Slot } from './slot.model'

const createSlotIntoDB = async (payload: TSlot) => {
  const result = await Slot.create(payload)
  return result
}

export const SlotServices = {
  createSlotIntoDB,
}
