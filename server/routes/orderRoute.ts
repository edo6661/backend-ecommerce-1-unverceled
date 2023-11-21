import express from 'express';
import {
	buy,
	createOrder,
	deleteOrder,
	getOrderById,
	getOrderByUser,
	getOrders,
	payingOrder,
	updateOrder,
} from '../controllers/orderController';
import protectedRoute from '../middlewares/protectedRoute';
const orderRoute = express.Router();

orderRoute.use(protectedRoute);
orderRoute.route('/order').get(getOrderByUser).post(createOrder);
orderRoute.route('/orders').get(getOrders).post(buy);
orderRoute
	.route('/order/:id')
	.patch(updateOrder)
	.delete(deleteOrder)
	.get(getOrderById);
orderRoute.patch('/pay/:id', payingOrder);

export default orderRoute;
