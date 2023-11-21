import express from 'express';
import { createUser, getUserByEmail, getUserById } from '../models/UsersSchema';
import userRoles from '../config/userRoles';
import matchPassword from '../utils/matchPassword';
import generateToken from '../utils/generateToken';
import bcrypt from 'bcrypt';
const register = async (req: express.Request, res: express.Response) => {
	try {
		const { username, email, password, roles, address, phone } = req.body;

		if (!username || !email || !password) {
			res.status(400).json({ message: 'required puh all field ' });
		}
		const emailExist = await getUserByEmail(email);
		if (emailExist) {
			res.status(409).json({ messsage: 'email dah ada yang daftar puh' });
		}

		const user = await createUser({
			username,
			email,
			password,
			roles: 'user',
			address,
			phone,
		});

		res
			.status(201)
			.json({ user, message: `user ${user.username} registered  puh` });
	} catch (error) {
		console.error(error);
	}
};
const login = async (req: express.Request, res: express.Response) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({ message: 'required puh all field' });
		}

		const userExist = await getUserByEmail(email).select(
			'username email password roles photo address phone '
		);
		if (!userExist) {
			return res.status(400).json({ message: 'gaada user di database puh' });
		}
		if (!(await matchPassword(password, userExist.password))) {
			return res.status(400).json({ message: 'password salah puh' });
		}

		generateToken(res, userExist._id.toString());

		await userExist.save();
		return res
			.status(201)
			.json({
				message: `user ${userExist.username} logged in puh`,
				user: {
					username: userExist.username,
					email: userExist.email,
					photo: userExist.photo,
					roles: userExist.roles,
					address: userExist.address,
					phone: userExist.phone,
				},
			})
			.end();
	} catch (error) {
		console.error(error);
	}
};
const logout = (req: express.Request, res: express.Response) => {
	try {
		const cookies = req.cookies.jwt;
		if (!cookies) {
			return res.status(400).json({ message: 'gapunya cookie puh' });
		}
		res.clearCookie('jwt', {
			httpOnly: true,
			sameSite: 'none',
			secure: true,
		});
		return res.json({ message: 'cookie cleared puh' }).end();
	} catch (error) {
		console.error(error);
	}
};

const verifyPassword = async (req: express.Request, res: express.Response) => {
	const { currentPassword } = req.body;
	try {
		const user = await getUserById(req.user.id.toString()).select('password');
		if (!user) {
			return res.status(404).json({ message: 'gaada user puh' });
		}

		const matchedPassword = await bcrypt.compare(
			currentPassword,
			user.password
		);
		if (!matchedPassword) {
			return res.status(401).json({ message: 'password lama salah puh' });
		}
		res.status(200).json({ message: 'password cocok puh' });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: 'terjadi kesalahan pada server' });
	}
};

const loginWithGoogle = async (req: express.Request, res: express.Response) => {
	const { username, email, photo } = req.body;
	try {
		const user = await getUserByEmail(email);
		if (user) {
			user.google = true;
			await user.save();
			generateToken(res, user._id.toString());
			return res.status(200).json({
				message: 'sukses login menggunakan google puh',
				user,
			});
		} else {
			const randomPassword = Math.random().toString(36).slice(-8);
			const newUser = await createUser({
				username:
					username.split(' ').join('').toLowerCase() +
					Math.random().toString(36).slice(-4),
				email,
				password: randomPassword,
				roles: 'user',
				photo,
			});
			generateToken(res, newUser._id.toString());

			return res.status(201).json({ message: 'sukses register dengan google' });
		}
	} catch (error) {
		console.error(error);
	}
};

export { register, login, logout, verifyPassword, loginWithGoogle };
