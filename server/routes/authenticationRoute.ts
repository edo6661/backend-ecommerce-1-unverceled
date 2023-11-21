import express from 'express';
import {
	register,
	login,
	logout,
	verifyPassword,
	loginWithGoogle,
} from '../controllers/authenticationController';
import protectedRoute from '../middlewares/protectedRoute';
const authRoute = express.Router();

authRoute.post('/register', register);
authRoute.post('/login', login);
authRoute.post('/oauth', loginWithGoogle);
authRoute.post('/verify', protectedRoute, verifyPassword);
authRoute.post('/logout', protectedRoute, logout);

export default authRoute;
