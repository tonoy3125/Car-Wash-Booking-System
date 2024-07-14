/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response } from 'express'
type responsedata = {
  statusCode: number
  success: boolean
  message: string
  data: any
}

const sendResponse = (res: Response, data: responsedata) => {
  res.status(data.statusCode).json({
    success: data.success,
    statusCode: data.statusCode,
    message: data.message,
    data: data.data,
  })
}

export default sendResponse
