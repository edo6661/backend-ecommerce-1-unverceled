import express from 'express';
import {
	getProducts,
	getProduct,
	deleteProduct,
	updateProduct,
	createProduct,
	getProductUser,
	getProductNoQuantity,
} from '../controllers/productController';
import protectedRoute from '../middlewares/protectedRoute';
import {
	adminPermission,
	userPermission,
} from '../middlewares/rolesPermission';

const productRoute = express.Router();

productRoute.get('/products', getProducts);
productRoute.get('/archivedProducts', getProductNoQuantity);
productRoute.get('/product/:id', getProduct);
productRoute
	.route('/product')
	.post(protectedRoute, userPermission, createProduct)
	.get(protectedRoute, userPermission, getProductUser);
productRoute
	.route('/product/:id')
	.delete(protectedRoute, userPermission, deleteProduct)
	.patch(protectedRoute, userPermission, updateProduct);

export default productRoute;
