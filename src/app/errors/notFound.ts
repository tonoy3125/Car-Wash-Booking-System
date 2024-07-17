/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from 'express';

const NotFound = (req: Request, res: Response) => {
  res.status(404).json({
    success: true,
    statusCode: 404,
    message: 'Not Found',
  });
};

export default NotFound;
