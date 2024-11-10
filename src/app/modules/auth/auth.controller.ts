import httpStatus from 'http-status'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { AuthServices } from './auth.service'
import config from '../../config'

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
  const { accessToken, user, refreshToken } = await AuthServices.login(
    req?.body,
  )
  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
  })
  //   send response
  res.status(httpStatus.OK).json({
    success: true,
    statusCode: httpStatus.OK,
    message: 'User logged in successfuly',
    accessToken,
    data: user,
  })
})

export const AuthControllers = {
  signUp,
  login,
}
