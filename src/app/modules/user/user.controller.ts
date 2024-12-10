import httpStatus from 'http-status'
import catchAsync from '../../utils/catchAsync'
import { UserServices } from './user.service'
import sendResponse from '../../utils/sendResponse'

const getAllUser = catchAsync(async (req, res) => {
  const result = await UserServices.getAllUserFromDB(req?.query)
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User Retrieved successfully!',
    meta: result.meta,
    data: result.result,
  })
})

const getSingleUser = catchAsync(async (req, res) => {
  const { id } = req.params
  const result = await UserServices.getSingleUserFromDB(id)
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User Retrieved successfully!',
    data: result,
  })
})

const updateUserRole = catchAsync(async (req, res) => {
  const { id } = req.params
  const { role: newRole } = req.body
  const result = await UserServices.updateUserRoleInDB(id, newRole)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User Role Updated Successfully!',
    data: result,
  })
})

const updateUser = catchAsync(async (req, res) => {
  const { id } = req.params
  const payload = req.body // All updated fields should be passed in the request body

  const result = await UserServices.updateUserIntoDB(id, payload)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User Updated Successfully!',
    data: result,
  })
})

const deleteUser = catchAsync(async (req, res) => {
  const { id } = req.params
  const result = await UserServices.deleteUserFromDB(id)
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User Deleted Successfully!',
    data: result,
  })
})

export const UserControllers = {
  getAllUser,
  getSingleUser,
  updateUserRole,
  updateUser,
  deleteUser,
}
