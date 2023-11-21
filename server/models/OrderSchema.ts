import mongoose from 'mongoose';
import orderStatus from '../config/orderStatus';
import { OrderDocument, OrderProduct } from '../types/orderType';
import { productModel } from './ProductSchema';
const OrderSchema = new mongoose.Schema<OrderDocument>(
	{
		userId: {
			type: mongoose.Schema.ObjectId,
			ref: 'User',
			required: true,
		},
		products: [
			{
				productId: {
					type: mongoose.Types.ObjectId,
					required: true,
					ref: 'Product',
				},
				quantity: {
					type: Number,
					required: true,
				},
			},
		],
		totalAmount: {
			type: Number,
			required: true,
		},
		status: {
			type: String,
			enum: orderStatus,
			default: 'Pending',
			required: true,
		},
		deliveryMethod: {
			type: String,
		},
		paymentMethod: {
			type: String,
		},
		cardNumber: {
			type: String,
		},
		estimationDeliveryDate: {
			type: Date,
		},
		shippingAddress: {
			type: String,
		},
		invoiceNumber: {
			type: String,
		},
	},
	{ timestamps: true }
);

OrderSchema.pre('save', async function (next) {
	if (this.isModified('status') && this.status == 'Processing') {
		try {
			for (const product of this.products) {
				const existingProduct = await productModel.findById(product.productId);

				if (existingProduct) {
					if (existingProduct.quantity >= product.quantity) {
						existingProduct.quantity -= product.quantity;
						await existingProduct.save();
					} else {
						this.status = 'Cancelled';
						await this.save();
						return next(new Error('Stok produk tidak mencukupi.'));
					}
				} else {
					throw new Error(
						'produk ga di temuin puh product id nya salah angel.'
					);
				}
			}
			next();
		} catch (error) {
			console.error(error);
			next(error);
		}
	}
});

const orderModel = mongoose.model<OrderDocument>('Order', OrderSchema);

const getAllOrders = () =>
	orderModel.find().populate('userId').populate('products.productId');

const getOrderByUserId = (id: string) =>
	orderModel.find({ userId: id }).populate({
		path: 'products.productId',
		select: 'name price photo reviewedBy ',
	});

const getOrderByCartId = (id: string) => orderModel.findById(id);

const postOrder = (values: Record<string, any>) =>
	new orderModel(values).save();

const deletingOrder = (id: string) => orderModel.findByIdAndDelete(id);

const updateOrderStatusProcessing = (id: string) =>
	orderModel.findOneAndUpdate(
		{ _id: id },
		{ status: 'Processing' },
		{ new: true }
	);

const findOrderStatusProcessing = (userId: string, productId: string) =>
	orderModel.findOne({
		userId,
		'products.productId': productId,
		status: 'Processing',
	});

export {
	deletingOrder,
	getAllOrders,
	getOrderByUserId,
	postOrder,
	updateOrderStatusProcessing,
	findOrderStatusProcessing,
	getOrderByCartId,
	orderModel,
};

export default OrderSchema;
