import express from 'express'
import { AuthRoutes } from '../modules/auth/auth.route'

const router = express.Router()

const routerModules = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
]

export const routes = routerModules.map((item) =>
  router.use(item?.path, item?.route),
)
