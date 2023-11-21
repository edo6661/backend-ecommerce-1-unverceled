import mongoose, { Model } from 'mongoose';
import userRoles from '../config/userRoles';
import bcrypt from 'bcrypt';
import { UserDocument } from '../types/userType';

const UserSchema = new mongoose.Schema<UserDocument>({
	username: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
		select: false,
	},
	photo: {
		type: String,
		default:
			'https://i.pinimg.com/236x/48/ec/29/48ec295871b72dd545d3f1915a1aa2d1.jpg',
	},
	address: {
		type: String,
	},
	roles: {
		type: String,
		enum: userRoles,
		default: 'user',
		required: true,
	},
	phone: {
		type: Number,
	},
	google: {
		type: Boolean,
	},
});

UserSchema.pre('save', async function (next) {
	if (!this.isModified('password')) {
		next();
	}

	this.password = await bcrypt.hash(this.password, 10);
});

export const userModel: Model<UserDocument> = mongoose.model(
	'User',
	UserSchema
);

const getAllUser = userModel.find();
const getAllUserNeID = (id: string) =>
	userModel.find({ _id: { $ne: id } }).clone();
const getUserByEmail = (email: string) => userModel.findOne({ email });
const getUserById = (id: string) => userModel.findById(id);
const createUser = (values: Record<string, any>) =>
	new userModel(values).save();

// const updateUserById = (
// 	id: string,
// 	username: string,
// 	email: string,
// 	password: string,
// 	address: string,
// 	phone: string
// ) =>
// 	userModel.findByIdAndUpdate(
// 		id,
// 		{
// 			$set: {
// 				username,
// 				email,
// 				password,
// 				address,
// 				phone,
// 			},
// 		},
// 		{ new: true }
// 	);

const deleteUserByOwnId = (id: string) => userModel.findByIdAndDelete(id);
const deleteUserByUserId = (id: string) =>
	userModel.findOneAndDelete({ _id: id });

export {
	getAllUser,
	getUserByEmail,
	getUserById,
	createUser,
	deleteUserByOwnId,
	deleteUserByUserId,
	// updateUserById,
	getAllUserNeID,
};

export default UserSchema;
