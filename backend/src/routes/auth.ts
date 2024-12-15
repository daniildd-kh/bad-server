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
import { validateAuthentication, validateUserBody } from '../middlewares/validations'
import sanitizeBody from '../middlewares/sanitizations'
import { csrfProtection } from '../middlewares/csrfProtection'

const authRouter = Router()

authRouter.get('/user', auth, getCurrentUser)
authRouter.patch('/me', csrfProtection, auth, validateUserBody, sanitizeBody(), updateCurrentUser)
authRouter.get('/user/roles', auth, getCurrentUserRoles)
authRouter.post('/login',validateAuthentication, sanitizeBody(), login)
authRouter.get('/token', refreshAccessToken)
authRouter.get('/logout', logout)
authRouter.post('/register',validateUserBody, sanitizeBody(), register)

export default authRouter
