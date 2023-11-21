import mongoose from 'mongoose';
import { CartItem, CartDocument } from '../types/cartType';
const cartItemSchema = new mongoose.Schema<CartItem>({
	productId: {
		type: mongoose.Schema.ObjectId,
		ref: 'Product',
		required: true,
	},
	quantity: {
		type: Number,
		required: true,
		min: 1,
		default: 1,
	},
	isChecked: {
		type: Boolean,
		default: false,
	},
});

const cartSchema = new mongoose.Schema<CartDocument>({
	userId: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		required: true,
	},
	items: [cartItemSchema],
	totalPrice: {
		type: Number,
	},
});

const cartModel = mongoose.model<CartDocument>('Cart', cartSchema);

const getCartByUserId = (userId: string) =>
	cartModel.findOne({ userId }).populate({
		path: 'items.productId',
		select: 'userId name price quantity photo',
	});

const updateQuantityByProductId = (id: string, quantity: number) =>
	cartModel.findOneAndUpdate(
		{ 'items.productId': id },
		{ $set: { 'items.$.quantity': quantity } },
		{ new: true }
	);
const updateIsCheckedByProductId = (id: string, isChecked: boolean) =>
	cartModel.findOneAndUpdate(
		{ 'items.productId': id },
		{ $set: { 'items.$.isChecked': isChecked } },
		{ new: true }
	);

const deleteProductCartChecked = () =>
	cartModel.updateMany(
		{ 'items.isChecked': true },
		{ $pull: { items: { isChecked: true } } }
	);

const addToCart = (values: Record<string, any>) => new cartModel().save();

export {
	getCartByUserId,
	addToCart,
	cartModel,
	updateQuantityByProductId,
	updateIsCheckedByProductId,
	deleteProductCartChecked,
};
