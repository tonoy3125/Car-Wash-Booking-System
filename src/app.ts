import express, { Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import globalErrorHandler from './app/middlewares/globalErrorHandler';

import { routes } from './app/routes';
import NotFound from './app/errors/notFound';

const app: Application = express();
// const port = 3000

// parser
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'https://aqua-auto-car-wash-booking-system-frontend.vercel.app',
      // 'https://car-wash-booking-system-six.vercel.app',
    ],
    credentials: true,
  }),
);

// Application Routes
app.use('/api', routes);

app.get('/', (req, res) => {
  res.send({
    message: 'Wellcome to Car Wash Backend',
  });
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.use(globalErrorHandler);

// Not found
app.use(NotFound);

export default app;
