import express, { NextFunction, Request, Response } from 'express'
import { UserControllers } from './user.controller'
import auth from '../../middlewares/auth'
import { USER_ROLE } from './user.constant'
import { upload } from '../../utils/sendImageToCloudinary'

const router = express.Router()

router.get('/', auth(USER_ROLE.admin), UserControllers.getAllUser)

router.get('/:id', auth('admin', 'user'), UserControllers.getSingleUser)

router.patch('/role/:id', auth(USER_ROLE.admin), UserControllers.updateUserRole)
router.patch(
  '/:id',
  auth('admin', 'user'),
  upload,
  (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.body?.data) {
        console.log('Raw req.body.data:', req.body.data) // Debug
        req.body = JSON.parse(req.body.data)
      }
      console.log('Parsed req.body:', req.body) // Debug
      next()
    } catch (error) {
      console.error('JSON parsing error:', error)
      return res.status(400).json({
        success: false,
        message: 'Invalid JSON format in data.',
        errorMessages: [{ path: '', message: 'Invalid JSON format in data.' }],
      })
    }
  },
  UserControllers.updateUser,
)

router.delete('/:id', auth(USER_ROLE.admin), UserControllers.deleteUser)

export const UserRoutes = router
