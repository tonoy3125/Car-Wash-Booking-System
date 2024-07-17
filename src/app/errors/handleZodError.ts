import { ZodError, ZodIssue } from 'zod'
import { TErrorMessages, TErrorResponse } from '../interface/error.interface'

const handleZodError = (error: ZodError): TErrorResponse => {
  const errorMessages: TErrorMessages = error.issues.map((issue: ZodIssue) => {
    return {
      path: issue.path[issue.path.length - 1],
      message: issue.message,
    }
  })

  return {
    statusCode: 400,
    message: 'Validation Error',
    errorMessages,
  }
}

export default handleZodError
