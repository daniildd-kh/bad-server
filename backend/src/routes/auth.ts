import { Router } from 'express'
import {
    getCurrentUser,
    getCurrentUserRoles,
    login,
    logout,
    refreshAccessToken,
    register,
    updateCurrentUser,
} from '../controllers/auth'
import auth from '../middlewares/auth'
import { sanitizeMiddleware } from '../middlewares/sanitize'
import { doubleCsrfProtection } from '../middlewares/csrf-handler'

const authRouter = Router()

authRouter.get('/user', auth, getCurrentUser)
authRouter.patch('/me', doubleCsrfProtection, auth, sanitizeMiddleware, updateCurrentUser)
authRouter.get('/user/roles', auth, getCurrentUserRoles)
authRouter.post('/login', sanitizeMiddleware, login)
authRouter.get('/token', refreshAccessToken)
authRouter.get('/logout', logout)
authRouter.post('/register', sanitizeMiddleware, register)

export default authRouter
