import express from 'express'
import { AuthRoutes } from '../modules/auth/auth.route'
import { ServiceRoutes } from '../modules/service/service.route'

const router = express.Router()

const routerModules = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/services',
    route: ServiceRoutes,
  },
]

export const routes = routerModules.map((item) =>
  router.use(item?.path, item?.route),
)
