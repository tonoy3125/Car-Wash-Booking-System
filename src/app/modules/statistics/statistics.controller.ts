import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { StatisticsServices } from './statistics.service';

const getRecentStatistics = catchAsync(async (req, res) => {
  const result = await StatisticsServices.getRecentStatistics();
  sendResponse(res, {
    data: result,
    success: true,
    message: 'Successfully Get Recent Statistics',
    statusCode: 200,
  });
});

export const StatisticsControllers = {
  getRecentStatistics,
};
