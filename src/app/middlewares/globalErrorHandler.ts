/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */

import { ErrorRequestHandler } from 'express'
import { TErrorMessages } from '../interface/error.interface'
import { ZodError } from 'zod'
import handleZodError from '../errors/handleZodError'
import handleValidationError from '../errors/handleValidationError'
import handleCastError from '../errors/handleCastError'
import handleDuplicateError from '../errors/handleDuplicateError'
import { AppError } from '../errors/AppError'

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode = 500
  let message = 'Something went went'
  let errorMessages: TErrorMessages = [
    {
      path: '',
      message: 'Something went wrong',
    },
  ]

  if (err instanceof ZodError) {
    const response = handleZodError(err)
    statusCode = response.statusCode
    message = response.message
    errorMessages = response.errorMessages
  } else if (err.name === 'ValidationError') {
    const response = handleValidationError(err)
    statusCode = response.statusCode
    message = response.message
    errorMessages = response.errorMessages
  } else if (err.name === 'CastError') {
    const response = handleCastError(err)
    statusCode = response.statusCode
    message = response.message
    errorMessages = response.errorMessages
  } else if (err.code === 11000) {
    const response = handleDuplicateError(err)
    statusCode = response.statusCode
    message = response.message
    errorMessages = response.errorMessages
  } else if (err instanceof AppError) {
    statusCode = err.statusCode
    message = err.message
    errorMessages = [
      {
        path: '',
        message: err?.message,
      },
    ]
  } else if (err instanceof Error) {
    message = err.message
    errorMessages = [
      {
        path: '',
        message: err?.message,
      },
    ]
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorMessages,
    stack: err.stack,
  })
}

export default globalErrorHandler
