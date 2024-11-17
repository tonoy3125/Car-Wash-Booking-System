import httpStatus from 'http-status'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { ServiceServices } from './service.service'

const createService = catchAsync(async (req, res) => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] }
  const result = await ServiceServices.createServiceIntoDB(files, req?.body)
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Service created successfully',
    data: result,
  })
})

const getSingleService = catchAsync(async (req, res) => {
  const { id } = req.params
  const result = await ServiceServices.getSingleServiceFromDB(id)
  sendResponse(res, {
    success: result ? true : false,
    statusCode: result ? httpStatus.OK : httpStatus.NOT_FOUND,
    message: result ? 'Service retrieved successfully' : 'No Data Found',
    data: result ? result : [],
  })
})

const getAllService = catchAsync(async (req, res) => {
  const result = await ServiceServices.getAllServiceFromDB(req?.query)
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Services retrieved successfully!',
    meta: result.meta,
    data: result.result,
  })
})

const updateService = catchAsync(async (req, res) => {
  const { id } = req.params
  const files = req.files as { [fieldname: string]: Express.Multer.File[] }
  const payload = req.body // Use the request body as the update payload

  console.log('Files:', files)
  console.log('Payload:', payload)

  // Pass the payload and files to the service for update
  const result = await ServiceServices.updateServiceIntoDB(id, payload, files)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Service updated successfully!',
    data: result,
  })
})

const deleteService = catchAsync(async (req, res) => {
  const { id } = req.params
  const result = await ServiceServices.deleteServiceFromDB(id)
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Service deleted successfully!',
    data: result,
  })
})

export const ServiceControllers = {
  createService,
  getSingleService,
  getAllService,
  updateService,
  deleteService,
}
