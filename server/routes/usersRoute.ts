import express from 'express';
import {
	getUsers,
	getUser,
	updateUser,
	deleteOwnUser,
	deleteUser,
	getUsersNeId,
	updateRoles,
} from '../controllers/userController';
import protectedRoute from '../middlewares/protectedRoute';
import {
	adminPermission,
	ownerPermission,
} from '../middlewares/rolesPermission';
const userRoute = express.Router();

userRoute.get('/allUser', protectedRoute, getUsers);
userRoute
	.route('/user')
	.get(protectedRoute, getUser)
	.patch(protectedRoute, updateUser)
	.delete(protectedRoute, deleteOwnUser);

userRoute.delete('/user/:id', protectedRoute, adminPermission, deleteUser);

userRoute
	.route('/users')
	.get(protectedRoute, ownerPermission, getUsersNeId)
	.patch(protectedRoute, ownerPermission, updateRoles);
export default userRoute;
