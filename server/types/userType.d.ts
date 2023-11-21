import { Types } from 'mongoose';
interface User {
	id: Types.ObjectId;
	username: string;
	email: string;
	roles: string[] | string;
	address: string;
	phone: number;
}

interface UserDocument extends Document {
	username: string;
	email: string;
	password: string;
	photo: string;
	address?: string;
	roles: string;
	phone?: number;
	google?: boolean;
}

export { User, UserDocument };
