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

export const ServiceControllers = {
  createService,
}
