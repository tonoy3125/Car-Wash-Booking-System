import express, { Application, Request, Response } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
const app: Application = express()
// const port = 3000

// parser
app.use(express.json())
app.use(cookieParser())
app.use(cors({ origin: ['http://localhost:5173'] }))

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!')
})

export default app
