import express, { Application, Request, Response } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import globalErrorHandler from './app/middlewares/globalErrorHandler'

import { routes } from './app/routes'
import NotFound from './app/errors/notFound'

const app: Application = express()
// const port = 3000

// parser
app.use(express.json())
app.use(cookieParser())
app.use(cors({ origin: ['http://localhost:5173'] }))

// Application Routes
app.use('/api', routes)

const getAController = (req: Request, res: Response) => {
  const a = 10
  res.send(a)
}

app.get('/', getAController)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.use(globalErrorHandler)

// Not found
app.use(NotFound)

export default app
