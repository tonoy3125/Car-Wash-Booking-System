import { Router } from 'express';
import auth from '../../middlewares/auth';
import { StatisticsControllers } from './statistics.controller';

const router = Router();

router.get('/recent', auth('admin'), StatisticsControllers.getRecentStatistics);

export const StatisticsRoutes = router;
