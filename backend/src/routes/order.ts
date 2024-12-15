import { Router } from 'express'
import {
    createOrder,
    deleteOrder,
    getOrderByNumber,
    getOrderCurrentUserByNumber,
    getOrders,
    getOrdersCurrentUser,
    updateOrder,
} from '../controllers/order'
import { /* auth , */ roleGuardMiddleware } from '../middlewares/auth'
import { validateOrderBody } from '../middlewares/validations'
import { Role } from '../models/user'
import sanitizeBody from '../middlewares/sanitizations'
import { csrfProtection } from '../middlewares/csrfProtection'

const orderRouter = Router()

orderRouter.post('/',/* csrfProtection, */ validateOrderBody, sanitizeBody(['comment']), createOrder)
orderRouter.get('/all', roleGuardMiddleware(Role.Admin), getOrders)
orderRouter.get('/all/me', getOrdersCurrentUser)
orderRouter.get(
    '/:orderNumber',
    roleGuardMiddleware(Role.Admin),
    getOrderByNumber
)
orderRouter.get('/me/:orderNumber', getOrderCurrentUserByNumber)
orderRouter.patch(
    '/:orderNumber',
    validateOrderBody,
    sanitizeBody(['comment']),
    csrfProtection,
    roleGuardMiddleware(Role.Admin),
    updateOrder
)

orderRouter.delete('/:id', roleGuardMiddleware(Role.Admin), deleteOrder)

export default orderRouter
