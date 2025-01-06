import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import { UserValidations } from '../user/user.validation'
import { AuthControllers } from './auth.controller'
import { AuthValidations } from './auth.validation'

const router = express.Router()

router.post(
  '/signup',
  validateRequest(UserValidations.createUserValidationSchema),
  AuthControllers.signUp,
)

router.post(
  '/login',
  validateRequest(AuthValidations.loginValidationSchema),
  AuthControllers.login,
)

router.post(
  '/refresh-token',
  validateRequest(AuthValidations.refreshTokenValidationSchema),
  AuthControllers.refreshToken,
)

router.post(
  '/forget-password',
  validateRequest(AuthValidations.forgetPasswordValidationSchema),
  AuthControllers.forgetPassword,
)

export const AuthRoutes = router
