import { TService } from './service.interface'
import { Service } from './service.model'

const createServiceIntoDB = async (payload: TService) => {
  const result = await Service.create(payload)
  return result
}

const getSingleServiceFromDB = async (id: string) => {
  const result = await Service.findById(id)
  return result
}

const getAllServiceFromDB = async () => {
  const result = await Service.find()
  return result
}

export const ServiceServices = {
  createServiceIntoDB,
  getSingleServiceFromDB,
  getAllServiceFromDB,
}
