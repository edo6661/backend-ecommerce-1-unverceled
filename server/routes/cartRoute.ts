import express from 'express';
import {
	getCart,
	createCart,
	updateChecked,
	incrementQuantity,
	decrementQuantity,
	deleteCart,
	getTotalPrice,
} from '../controllers/cartController';
import protectedRoute from '../middlewares/protectedRoute';

const cartRoute = express.Router();
cartRoute.use(protectedRoute);
cartRoute.route('/carts').get(getCart).post(createCart);
cartRoute.patch('/carts/dec/:id', decrementQuantity);
cartRoute.patch('/carts/inc/:id', incrementQuantity);
cartRoute.get('/carts/total', getTotalPrice);
cartRoute.route('/cart/:id').patch(updateChecked).delete(deleteCart);

export default cartRoute;
