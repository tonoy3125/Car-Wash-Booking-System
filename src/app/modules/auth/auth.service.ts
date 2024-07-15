import httpStatus from 'http-status'
import { AppError } from '../../errors/AppError'
import { TUser } from '../user/user.interface'
import { User } from '../user/user.model'
import { TLoginUser } from './auth.interface'

const signUp = async (payload: TUser) => {
  const result = await User.create(payload)
  return result
}

const login = async (payload: TLoginUser) => {
  // check if the user is exits
  const user = await User.isUserExistsByEmail(payload.email)
  // console.log(user)

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User does not exists')
  }
}

export const AuthServices = {
  signUp,
  login,
}
