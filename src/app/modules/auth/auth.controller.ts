import httpStatus from 'http-status'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { AuthServices } from './auth.service'

const signUp = catchAsync(async (req, res) => {
  const result = await AuthServices.signUp(req.body)
  //   send response
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User registered successfully',
    data: result,
  })
})

const login = catchAsync(async (req, res) => {
  const result = await AuthServices.login(req.body)
  //   send response
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User logged in successfully',
    data: result,
  })
})

export const AuthControllers = {
  signUp,
  login,
}
