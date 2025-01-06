import { TUser } from '../user/user.interface'

export type TLoginUser = {
  email: string
  password: string
}

export type TResetPassword = {
  newPassword: string
  confirmNewPassword: string
}

export type TResetPasswordResult = {
  accessToken: string
  refreshToken: string
  user: TUser
}
