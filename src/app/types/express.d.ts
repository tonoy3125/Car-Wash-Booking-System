import { User } from '../modules/user/user.model'

declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: User['_id'] // or replace with appropriate type
        email: string
        role: string // adjust based on your user role type
      }
    }
  }
}
