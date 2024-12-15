import { Router } from 'express'
import {
    deleteCustomer,
    getCustomerById,
    getCustomers,
    updateCustomer,
} from '../controllers/customers'
import auth from '../middlewares/auth'
import { sanitizeMiddleware } from '../middlewares/sanitize'

const customerRouter = Router()

customerRouter.get('/', auth, getCustomers)
customerRouter.get('/:id', auth, getCustomerById)
customerRouter.patch('/:id', auth, sanitizeMiddleware, updateCustomer)
customerRouter.delete('/:id', auth, sanitizeMiddleware, deleteCustomer)

export default customerRouter
