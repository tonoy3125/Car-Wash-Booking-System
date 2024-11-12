import httpStatus from 'http-status'
import { AppError } from '../../errors/AppError'
import { TService } from './service.interface'
import { Service } from './service.model'
import QueryBuilder from '../../builder/QueryBuilder'
import { serviceSearchableField } from './service.constant'

const createServiceIntoDB = async (
  files: { [fieldname: string]: Express.Multer.File[] },
  payload: TService,
) => {
  if (files.image && files.image[0]) {
    payload.image = files.image[0].path // Assign the image URL
  }
  if (files.icon && files.icon[0]) {
    payload.icon = files.icon[0].path // Assign the icon URL
  }
  const result = await Service.create(payload)
  return result
}

const getSingleServiceFromDB = async (id: string) => {
  const result = await Service.findById(id)
  return result
}

const getAllServiceFromDB = async (query: Record<string, unknown>) => {
  const serviceQuery = new QueryBuilder(Service.find(), query)
    .search(serviceSearchableField)
    .filter()
    .sort()
    .paginate()
    .fields()

  // const result = await Service.find()
  // return result

  const meta = await serviceQuery.countTotal()
  const result = await serviceQuery.modelQuery

  return {
    meta,
    result,
  }
}

const updateServiceIntoDB = async (id: string, payload: Partial<TService>) => {
  const service = await Service.findById(id)

  if (!service) {
    throw new AppError(httpStatus.NOT_FOUND, 'Service Not Found by this id')
  }

  const result = await Service.findByIdAndUpdate(id, payload, { new: true })
  return result
}

const deleteServiceFromDB = async (id: string) => {
  const result = await Service.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  )
  return result
}

export const ServiceServices = {
  createServiceIntoDB,
  getSingleServiceFromDB,
  getAllServiceFromDB,
  updateServiceIntoDB,
  deleteServiceFromDB,
}
