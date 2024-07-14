import { JwtPayload } from 'jsonwebtoken'

export interface TJwtPayload extends JwtPayload {
  email: string
  role: string
}
