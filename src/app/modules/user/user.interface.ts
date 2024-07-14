import { USER_ROLE } from './user.constant'

export type TUserRoles = keyof typeof USER_ROLE

export type TUser = {
  name: string
  email: string
  password: string
  phone: number
  role: TUserRoles
  address: string
}
