import httpStatus from 'http-status'
import sendResponse from '../../utils/sendResponse'
import { ReviewServices } from './review.service'
import catchAsync from '../../utils/catchAsync'

const createReview = catchAsync(async (req, res) => {
  const result = await ReviewServices.createReviewIntoDB(req.body)
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Review Created Successfully',
    data: result,
  })
})

export const ReviewControllers = {
    createReview,
}
