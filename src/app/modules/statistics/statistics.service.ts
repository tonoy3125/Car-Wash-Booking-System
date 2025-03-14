import Payment from '../payment/payment.model';

const getRecentStatistics = async () => {
  const transactions = await Payment.aggregate([
    { $sort: { createdAt: -1 } },

    { $limit: 30 },

    // Group by date and sum the amounts
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, //YYYY-MM-DD
        totalAmount: { $sum: '$amount' },
      },
    },
    // Sort grouped data in ascending order by date
    { $sort: { _id: 1 } },
  ]);

  const formattedData = transactions.map((item) => ({
    date: item._id,
    amount: item.totalAmount,
  }));

  return formattedData;
};

export const StatisticsServices = {
  getRecentStatistics,
};
