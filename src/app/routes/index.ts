import express from 'express';
import { AuthRoutes } from '../modules/auth/auth.route';
import { ServiceRoutes } from '../modules/service/service.route';
import { SlotRoutes, SlotRoutes2 } from '../modules/slot/slot.route';
import {
  BookingRoutes,
  BookingRoutes2,
} from '../modules/booking/booking.route';
import { UserRoutes } from '../modules/user/user.route';
import { PaymentRoutes } from '../modules/payment/payment.route';
import { ReviewRoutes } from '../modules/review/review.route';
import { StatisticsRoutes } from '../modules/statistics/statistics.route';

const router = express.Router();

const routerModules = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/services',
    route: ServiceRoutes,
  },
  {
    path: '/services/slots',
    route: SlotRoutes,
  },
  {
    path: '/slots/availability',
    route: SlotRoutes2,
  },
  {
    path: '/bookings',
    route: BookingRoutes,
  },
  {
    path: '/my-bookings',
    route: BookingRoutes2,
  },
  {
    path: '/payment',
    route: PaymentRoutes,
  },
  {
    path: '/review',
    route: ReviewRoutes,
  },
  {
    path: '/statistics',
    route: StatisticsRoutes,
  },
];

export const routes = routerModules.map((item) =>
  router.use(item?.path, item?.route),
);
