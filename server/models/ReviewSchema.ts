import mongoose from 'mongoose';
const ReviewSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	productId: {
		type: mongoose.Types.ObjectId,
		ref: 'Product',
		required: true,
	},
	rating: {
		type: Number,
		required: true,
		min: 1,
		max: 5,
	},
	comment: {
		type: String,
	},
});

const reviewModel = mongoose.model('Review', ReviewSchema);

const getAllReview = () =>
	reviewModel
		.find()
		.populate({ path: 'userId' })
		.populate({ path: 'productId' });

const getReviewByUserId = (id: string) => reviewModel.find({ userId: id });

const getReviewByUserIdProductId = (userId: string, productId: string) =>
	reviewModel
		.find({ userId, productId })
		.populate({ path: 'userId' })
		.populate({ path: 'productId' });

const getReviewByProductId = (id: string) =>
	reviewModel.find({ productId: id }).populate('userId', 'username');

const getReviewById = (id: string) => reviewModel.findById(id);

const postReview = (values: Record<string, any>) =>
	new reviewModel(values).save();

const deleteReviewById = (id: string) => reviewModel.deleteOne({ _id: id });

export {
	getAllReview,
	getReviewByUserId,
	postReview,
	deleteReviewById,
	getReviewByProductId,
	getReviewById,
	getReviewByUserIdProductId,
};

export default ReviewSchema;
