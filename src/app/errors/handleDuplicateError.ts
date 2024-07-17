/* eslint-disable @typescript-eslint/no-explicit-any */

import { TErrorMessages, TErrorResponse } from '../interface/error.interface'

const handleDuplicateError = (error: any): TErrorResponse => {
  const errorMessages: TErrorMessages = [
    {
      path: '',
      message: error.errorResponse.errmsg,
    },
  ]

  return {
    statusCode: 400,
    message: error.errorResponse.errmsg,
    errorMessages,
  }
}

export default handleDuplicateError
