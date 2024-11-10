import jwt, { JwtPayload } from 'jsonwebtoken'
import { NextFunction, Request, Response } from 'express'
import { TUserRoles } from '../modules/user/user.interface'
import config from '../config'
import { User } from '../modules/user/user.model'
import httpStatus from 'http-status'

const auth = (...requiredRoles: TUserRoles[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(' ')[1]

      if (!token) {
        throw new Error()
      }

      const decoded = jwt.verify(
        token as string,
        config.jwt_access_secret as string,
      ) as JwtPayload
      const { email, role } = decoded

      const user = await User.findOne({ email, role })

      if (!user) {
        throw new Error()
      }
      // console.log(user)

      if (!requiredRoles.includes(role)) {
        throw new Error()
      }
      req.user = {
        _id: user._id,
        email,
        role,
      }

      next()
    } catch (err) {
      res.status(404).json({
        success: false,
        statusCode: httpStatus.UNAUTHORIZED,
        message: 'You have no access to this route',
      })
    }
  }
}

export default auth
