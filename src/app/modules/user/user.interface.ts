import { Model } from 'mongoose'
import { USER_ROLE } from './user.constant'
import { UserModel } from './user.interface'

export type TUserRoles = keyof typeof USER_ROLE

export type TUser = {
  name: string
  email: string
  password: string
  phone: number
  role: TUserRoles
  address: string
}

export interface UserModel extends Model<TUser> {
  isUserExistsByEmail(email: string): Promise<TUser>
}
