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

const updateSlotStatus = catchAsync(async (req, res) => {
  const { id } = req.params // Slot ID
  const { isBooked } = req.body // New status (available or canceled)

  const result = await SlotServices.updateSlotStatusInDB(id, isBooked)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Slot status updated successfully',
    data: result,
  })
})

export const SlotControllers = {
  createSlot,
  getAvailableSlots,
  updateSlotStatus,
}
