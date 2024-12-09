import express from 'express'
import { UserControllers } from './user.controller'
import auth from '../../middlewares/auth'
import { USER_ROLE } from './user.constant'

const router = express.Router()

router.get('/', auth(USER_ROLE.admin), UserControllers.getAllUser)

router.patch('/role/:id', auth(USER_ROLE.admin), UserControllers.updateUserRole)
router.patch('/:id', auth('admin', 'user'), UserControllers.updateUser)

router.delete('/:id', auth(USER_ROLE.admin), UserControllers.deleteUser)

export const UserRoutes = router
