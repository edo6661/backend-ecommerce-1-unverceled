import express from 'express';
import {
	getReviewByProduct,
	getReviewByUser,
	getReviews,
	createReview,
	updateReview,
	deleteReview,
	getReviewByProductUser,
} from '../controllers/reviewController';
const reviewRoute = express.Router();

reviewRoute.get('/reviews', getReviews);

reviewRoute.route('/review').get(getReviewByUser);
reviewRoute
	.route('/product/:id/review')
	.get(getReviewByProduct)
	.post(createReview);

reviewRoute
	.route('/review/:id')
	.patch(updateReview)
	.delete(deleteReview)
	.get(getReviewByProductUser);

export default reviewRoute;
