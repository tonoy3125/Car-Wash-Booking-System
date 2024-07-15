import httpStatus from 'http-status'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { ServiceServices } from './service.service'

const createService = catchAsync(async (req, res) => {
  const result = await ServiceServices.createServiceIntoDB(req?.body)
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
    data: result,
  })
})

const getAllService = catchAsync(async (req, res) => {
  const result = await ServiceServices.getAllServiceFromDB()
  sendResponse(res, {
    success: result.length ? true : false,
    statusCode: result.length ? httpStatus.OK : httpStatus.NOT_FOUND,
    message: result.length
      ? 'Services retrieved successfully'
      : 'No Data Found',
    data: result,
  })
})

export const ServiceControllers = {
  createService,
  getSingleService,
  getAllService,
}
