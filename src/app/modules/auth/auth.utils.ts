import jwt, { JwtPayload } from 'jsonwebtoken'
import { AppError } from '../../errors/AppError'
import httpStatus from 'http-status'

const createToken = (
  jwtPayload: { email: string; role: string },
  secret: string,
  expiresIn: string,
) => {
  return jwt.sign(jwtPayload, secret, {
    expiresIn,
  })
}

export default createToken

export const verifyToken = (token: string, secret: string) => {
  try {
    return jwt.verify(token, secret) as JwtPayload
  } catch (err) {
    const error = err as Error
    if (error.name === 'TokenExpiredError') {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Token has expired')
    }
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid token')
  }
}
