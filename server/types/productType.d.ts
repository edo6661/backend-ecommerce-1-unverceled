import mongoose from 'mongoose';

interface ProductAttributes {
	userId: mongoose.Types.ObjectId;
	name: string;
	description: string;
	price: number;
	quantity: number;
	category?: string;
	brand?: string;
	photo?: string[];
	reviewedBy: mongoose.Types.ObjectId[];
}

export default ProductAttributes;
