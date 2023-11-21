import mongoose from 'mongoose';
import ProductAttributes from '../types/productType';
const ProductSchema = new mongoose.Schema<ProductAttributes>(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'User',
		},
		name: { type: String, required: true },
		description: { type: String, required: true },
		price: { type: Number, required: true, min: 1 },
		quantity: { type: Number, required: true, min: 0 },
		category: { type: String },
		brand: { type: String },
		photo: {
			type: [String],
			required: true,
		},
		reviewedBy: [
			{
				type: mongoose.Types.ObjectId,
				ref: 'User',
			},
		],
	},
	{
		timestamps: true,
	}
);

const productModel = mongoose.model('Product', ProductSchema);

const getAllProducts = productModel.find().populate({
	path: 'userId',
	select: 'username photo email',
});

const getProductByid = (id: string) =>
	productModel.findById(id).populate({
		path: 'userId',
		select: 'username photo email',
	});

const getProductByUser = (id: string) => productModel.find({ userId: id });

const postProduct = (values: Record<string, any>) =>
	new productModel(values).save();

const deleteProductById = (id: string) => productModel.findByIdAndDelete(id);

export {
	productModel,
	getAllProducts,
	getProductByid,
	postProduct,
	deleteProductById,
	getProductByUser,
};

export default ProductSchema;
