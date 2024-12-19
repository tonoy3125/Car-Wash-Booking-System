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

const getAllReviews = catchAsync(async (req, res) => {
  const result = await ReviewServices.getAllReviewsFromDB(req?.query)
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Review Retrieved Successfully!',
    meta: result.meta,
    data: result.result,
  })
})

export const ReviewControllers = {
  createReview,
  getAllReviews,
}
