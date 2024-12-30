import httpStatus from 'http-status'
import catchAsync from '../../utils/catchAsync'
import { UserServices } from './user.service'
import sendResponse from '../../utils/sendResponse'
import { User } from './user.model'
import { AppError } from '../../errors/AppError'

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
  const files = req.files as { [fieldname: string]: Express.Multer.File[] }
  const { id } = req.params
  const payload = req.body // All updated fields should be passed in the request body

  // Fetch the user by ID to determine their role
  const user = await User.findById(id)

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found with this ID')
  }

  const result = await UserServices.updateUserIntoDB(id, files, payload)

  // Determine the success message based on the user's role
  const message =
    user.role === 'admin'
      ? 'Admin Profile Updated Successfully!'
      : 'User Profile Updated Successfully!'

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message,
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
