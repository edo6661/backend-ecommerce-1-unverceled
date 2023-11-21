import { Router } from 'express';
import protectedRoute from '../middlewares/protectedRoute';
import {
	createHistoryPayment,
	deleteById,
	getById,
	getByUserId,
} from '../controllers/HistoryPaymentController';

const historyPaymentRoute = Router();

historyPaymentRoute.use(protectedRoute);

historyPaymentRoute
	.route('/payments')
	.get(getByUserId)
	.post(createHistoryPayment);

historyPaymentRoute.use(protectedRoute);
historyPaymentRoute.route('/payment/:id').get(getById).delete(deleteById);

export default historyPaymentRoute;
