import express from 'express';
import {
	deleteUserByOwnId,
	deleteUserByUserId,
	getAllUser,
	getAllUserNeID,
	getUserByEmail,
	getUserById,
} from '../models/UsersSchema';
import userRoles from '../config/userRoles';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const getUsers = async (req: express.Request, res: express.Response) => {
	try {
		// ! biar bisa execute query terus terusan gk dapat error dari bang mongoose
		const users = await getAllUser.clone();

		if (!users) {
			return res
				.status(400)
				.json({ message: 'gaada users puh utk saat ini ' })
				.end();
		}
		return res.status(200).json(users);
	} catch (error) {
		console.error(error);
	}
};

const getUsersNeId = async (req: express.Request, res: express.Response) => {
	try {
		// ! biar bisa execute query terus terusan gk dapat error dari bang mongoose
		const users = await getAllUserNeID(req.user.id.toString()).clone();

		if (!users) {
			return res
				.status(400)
				.json({ message: 'gaada users puh utk saat ini ' })
				.end();
		}
		return res.status(200).json(users);
	} catch (error) {
		console.error(error);
	}
};

const getUser = async (req: express.Request, res: express.Response) => {
	try {
		if (!req.user) {
			return res.status(400).json({ message: 'gaada users puh ' });
		}
		const user = await getUserById(req.user.id.toString());
		if (!user) {
			return res.status(400).json({ message: 'gaada user puh ' });
		}
		res.status(200).json(user);
	} catch (error) {
		console.error(error);
	}
};
const updateUser = async (req: express.Request, res: express.Response) => {
	try {
		const { username, email, newPassword, roles, address, phone, photo } =
			req.body;
		const { id } = req.user;
		const user = await getUserById(id.toString());

		if (!user) {
			return res.status(400).json({ message: 'user gaada di database puh' });
		}
		const emailExist = await getUserByEmail(email);

		if (emailExist && emailExist._id !== req.user.id) {
			return res.status(400).json({ message: 'email udah ada yang pakai puh' });
		}

		if (username) {
			user.username = username;
		}
		if (email) {
			user.email = email;
		}
		if (newPassword) {
			user.password = newPassword;
		}
		if (address) {
			user.address = address;
		}
		if (phone) {
			user.phone = phone;
		}
		if (photo) {
			user.photo = photo;
		}

		await user.save();
		res.status(200).json({ message: 'updated puh' });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: 'terjadi kesalahan pada server' });
	}
};

const updateRoles = async (req: express.Request, res: express.Response) => {
	try {
		const { _id, roles } = req.body;
		if (!mongoose.Types.ObjectId.isValid(_id)) {
			return res
				.status(400)
				.json({ message: 'id nya harus type of mongodb id puh' });
		}
		if (!_id) {
			return res.status(400).json({ message: 'id required' });
		}
		const user = await getUserById(_id);
		if (!user) {
			return res.status(400).json({ message: 'user gaada di database puh' });
		}
		if (roles) {
			if (roles === user.roles) {
				return res
					.status(400)
					.json({ message: 'roles yang diganti sama dengan yang dulu' });
			}
			user.roles = roles;
		}
		await user.save();
		res.status(200).json({
			message: `roles di update untuk user ${user.username}, roles ${user.roles}  `,
		});
	} catch (err) {
		console.error(err);
	}
};

const deleteOwnUser = async (req: express.Request, res: express.Response) => {
	try {
		const { id, username } = req.user;

		if (!req.user) {
			res.status(400).json({ messsage: 'gaada user puh' });
		}

		await deleteUserByOwnId(id.toString());

		res.status(200).json({ message: `user ${username} telah di hapus puh` });
	} catch (error) {
		console.error(error);
	}
};

const deleteUser = async (req: express.Request, res: express.Response) => {
	try {
		if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
			return res.status(400).json({
				message:
					'ID user tidak valid puh , bukan object id dari mongodb params nya ',
			});
		}
		const users = await getAllUser.clone();

		if (!users) {
			return res.status(404).json({
				message: 'gaada user puh ',
			});
		}

		const deletedUser = await deleteUserByUserId(req.params.id);

		res.status(200).json({
			message: `user ${deletedUser.username} telah didelete puh`,
			deleteUser,
		});
	} catch (error) {
		console.error(error);
	}
};

export {
	getUsers,
	getUser,
	updateUser,
	deleteOwnUser,
	deleteUser,
	getUsersNeId,
	updateRoles,
};
