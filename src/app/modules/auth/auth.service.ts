import { TUser } from '../user/user.interface'
import { User } from '../user/user.model'
import { TLoginUser } from './auth.interface'

const signUp = async (payload: TUser) => {
  const result = await User.create(payload)
  return result
}

const login=async(payload:TLoginUser)=>{
  
}

export const AuthServices = {
  signUp,
}
