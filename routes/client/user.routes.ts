import { Router } from 'express'
import { signin, signup, profile } from '../../controllers/client/user.controller'

import { requireAuth } from '../../middlewares/require-auth.middleware'

const router = Router()

router.post('/signup', signup)
router.post('/signin', signin)
router.get('/profile', requireAuth, profile)

export default router
