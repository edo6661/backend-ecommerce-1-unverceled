import { Router } from 'express';
import {
	createPayment,
	deletePayment,
	getPayment,
	updatePayment,
} from '../controllers/paymentController';
import protectedRoute from '../middlewares/protectedRoute';

const paymentRoute = Router();

paymentRoute.use(protectedRoute);
paymentRoute
	.route('/pay')
	.get(getPayment)
	.post(createPayment)
	.patch(updatePayment)
	.delete(deletePayment);

export default paymentRoute;
