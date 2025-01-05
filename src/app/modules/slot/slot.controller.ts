import httpStatus from 'http-status'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { SlotServices } from './slot.service'

const createSlot = catchAsync(async (req, res) => {
  const result = await SlotServices.createSlotIntoDB(req?.body)
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Slots created successfully!',
    data: result,
  })
})

const getAvailableSlots = catchAsync(async (req, res) => {
  console.log(req?.query)
  const result = await SlotServices.getAvailableSlotsFromDB(req.query)
  // console.log(result)
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Available slots retrieved successfully!!',
    meta: result.meta,
    data: result.result,
  })
})

const getSlotsByService = catchAsync(async (req, res) => {
  const { serviceId } = req.params
  const query = req.query

  const result = await SlotServices.getSlotsByServiceFromDB(serviceId, query)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Slots retrieved successfully for the specified service!',
    data: result,
  })
})

const updateSlotStatus = catchAsync(async (req, res) => {
  const { id } = req.params
  const { isBooked } = req.body

  const result = await SlotServices.updateSlotStatusInDB(id, isBooked)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Slot status updated successfully',
    data: result,
  })
})

const deleteSlot = catchAsync(async (req, res) => {
  const { id } = req.params
  const result = await SlotServices.deleteSlotFromDB(id)
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Slot Deleted Successfully!',
    data: result,
  })
})

export const SlotControllers = {
  createSlot,
  getAvailableSlots,
  getSlotsByService,
  updateSlotStatus,
  deleteSlot,
}
