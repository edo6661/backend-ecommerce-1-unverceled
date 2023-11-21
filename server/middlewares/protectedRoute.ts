import express from 'express';
import jwt from 'jsonwebtoken';
import { getUserById } from '../models/UsersSchema';
import { User } from '../types/userType';
declare global {
	namespace Express {
		interface Request {
			user?: User;
		}
	}
}

const protectedRoute = async (
	req: express.Request,
	res: express.Response,
	next: express.NextFunction
) => {
	const token = req.cookies.jwt;
	if (!token) {
		return res.status(401).json({
			message: 'cookie gaada puh jdi di handle ama bang middleware',
		});
	}
	try {
		const decoded = await jwt.verify(token, process.env.JWT_SECRET);

		const user = await getUserById(decoded.userId);

		if (!user) {
			return res.status(401).json({ message: 'gaada usernya puh' });
		}

		req.user = {
			id: user._id,
			username: user.username,
			email: user.email,
			roles: user.roles,
			address: user.address,
			phone: user.phone,
		};

		next();
	} catch (err) {
		if (err.name === 'TokenExpiredError') {
			const refreshToken = req.cookies.refreshJwt;
			if (!refreshToken) {
				return res.status(401).json({ message: 'No refresh token provided' });
			}
			let decodedRefreshToken;
			try {
				decodedRefreshToken = await jwt.verify(
					refreshToken,
					process.env.REFRESH_JWT_SECRET
				);
			} catch (err) {
				return res.status(401).json({ message: 'Invalid refresh token' });
			}
			const user = await getUserById(decodedRefreshToken.userId);
			if (!user) {
				return res.status(401).json({ message: 'User not found' });
			}
			const newToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
				expiresIn: '1h',
			});
			res.cookie('jwt', newToken, { httpOnly: true, secure: true });
			req.user = {
				id: user._id,
				username: user.username,
				email: user.email,
				roles: user.roles,
				address: user.address,
				phone: user.phone,
			};
			next();
		} else {
			throw new Error(err);
		}
	}
};

export default protectedRoute;
