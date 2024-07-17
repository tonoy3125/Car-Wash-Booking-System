import mongoose from 'mongoose'
import { TErrorMessages, TErrorResponse } from '../interface/error.interface'

const handleCastError = (error: mongoose.Error.CastError): TErrorResponse => {
  const errorMessages: TErrorMessages = [
    {
      path: error.path,
      message: error.message,
    },
  ]

  return {
    statusCode: 400,
    message: 'Validation Error',
    errorMessages,
  }
}

export default handleCastError
