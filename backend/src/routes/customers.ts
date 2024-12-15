import { Router } from 'express'
import {
  deleteCustomer,
  getCustomerById,
  getCustomers,
  updateCustomer,
} from '../controllers/customers'
import { validateUserBody } from '../middlewares/validations'
import sanitizeBody from '../middlewares/sanitizations'

const customerRouter = Router()

customerRouter.get('/', getCustomers)
customerRouter.get('/:id', getCustomerById)
customerRouter.patch('/:id', validateUserBody, sanitizeBody(), updateCustomer)
customerRouter.delete('/:id', validateUserBody, sanitizeBody(), deleteCustomer)

export default customerRouter
