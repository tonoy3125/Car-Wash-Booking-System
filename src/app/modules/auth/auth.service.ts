import httpStatus from 'http-status'
import { AppError } from '../../errors/AppError'
import { TUser } from '../user/user.interface'
import { User } from '../user/user.model'
import { TLoginUser } from './auth.interface'
import jwt from 'jsonwebtoken'
import config from '../../config'

const signUp = async (payload: TUser) => {
  const result = await User.create(payload)
  return result
}

const login = async (payload: TLoginUser) => {
  // check if the user is exits
  const user = await User.isUserExistsByEmail(payload.email)
  console.log(user)

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User does not exists')
  }

  // const isPasswordMatch = await User.isPasswordMatch(
  //   payload.password,
  //   user.password,
  // )
  // console.log(isPasswordMatch)

  console.log(payload.password)

  if (!(await User.isPasswordMatch(payload.password, user.password))) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Password Does Not Match')
  }

  const jwtPayload = {
    email: user?.email,
    role: user?.role,
  }

  const token = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
    expiresIn: config.jwt_access_expires_in,
  })

  return {
    token,
    user,
  }
}

export const AuthServices = {
  signUp,
  login,
}
