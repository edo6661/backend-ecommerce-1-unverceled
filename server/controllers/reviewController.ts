import express from 'express';
import {
	deleteReviewById,
	getAllReview,
	getReviewById,
	getReviewByProductId,
	getReviewByUserId,
	getReviewByUserIdProductId,
	postReview,
} from '../models/ReviewSchema';
import mongoose from 'mongoose';
import { findOrderStatusProcessing } from '../models/OrderSchema';
import { productModel } from '../models/ProductSchema';

const getReviews = async (req: express.Request, res: express.Response) => {
	try {
		const reviews = await getAllReview();
		if (!reviews || !reviews.length)
			return res.status(404).json({ message: 'no reviews' });

		res.status(200).json(reviews);
	} catch (error) {
		console.error(error);
	}
};
const getReviewByProductUser = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
			return res.status(400).json({
				message:
					'ID produk tidak valid puh , bukan object id dari mongodb params nya ',
			});
		}

		const review = await getReviewByUserIdProductId(
			req.user.id.toString(),
			req.params.id
		);
		if (!review) return res.status(404).json({ message: 'no review' });

		res.status(200).json(review);
	} catch (error) {
		console.error(error);
	}
};
const getReviewByUser = async (req: express.Request, res: express.Response) => {
	try {
		const reviews = await getReviewByUserId(req.user.id.toString());
		if (!reviews || !reviews.length)
			return res.status(404).json({ message: 'no reviews' });

		res.status(200).json(reviews);
	} catch (error) {
		console.error(error);
	}
};
const getReviewByProduct = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
			return res.status(400).json({
				message:
					'ID produk tidak valid puh , bukan object id dari mongodb params nya ',
			});
		}
		const reviews = await getReviewByProductId(req.params.id);
		if (!reviews || !reviews.length) {
			return res.status(404).json({ message: 'no reviews' });
		}
		return res.status(200).json(reviews);
	} catch (error) {
		console.error(error);
	}
};
const createReview = async (req: express.Request, res: express.Response) => {
	try {
		const { rating, comment } = req.body;
		if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
			return res.status(400).json({
				message:
					'ID produk tidak valid puh , bukan object id dari mongodb params nya ',
			});
		}

		if (!rating) {
			return res.status(400).json({ message: 'rating required puh' });
		}

		const orderProcessing = await findOrderStatusProcessing(
			req.user.id.toString(),
			req.params.id
		);

		if (!orderProcessing) {
			return res.status(400).json({
				message:
					'order harus sudah dibayar sebelum memberi rating, status harus processing ',
			});
		}

		const product = await productModel.findById(req.params.id.toString());

		if (product.reviewedBy.includes(req.user.id)) {
			return res.status(400).json({
				message: 'Anda sudah memberikan ulasan pada produk ini sebelumnya',
			});
		}

		const reviews = await postReview({
			userId: req.user.id,
			productId: req.params.id,
			rating,
			comment,
		});

		product.reviewedBy.push(req.user.id);
		await product.save();

		res.status(201).json(reviews);
	} catch (error) {
		console.error(error);
	}
};
const updateReview = async (req: express.Request, res: express.Response) => {
	const { rating, comment } = req.body;
	try {
		if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
			return res.status(400).json({
				message:
					'ID review tidak valid puh , bukan object id dari mongodb params nya ',
			});
		}

		const review = await getReviewById(req.params.id);

		if (!review) {
			return res.status(404).json({ message: 'no reviews' });
		}

		if (rating) {
			if (rating === review.rating) {
				return res.status(409).json({
					message:
						'rating review yang diubah itu sama dengan rating review yang dulu puh',
				});
			}
			review.rating = rating;
		}

		if (comment) {
			if (rating === review.comment) {
				return res.status(409).json({
					message:
						'comments review yang diubah itu sama dengan comment review yang dulu puh',
				});
			}
			review.comment = comment;
		}

		await review.save();

		res.status(200).json(review);
	} catch (error) {
		console.error(error);
	}
};
const deleteReview = async (req: express.Request, res: express.Response) => {
	try {
		if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
			return res.status(400).json({
				message:
					'ID produk tidak valid puh , bukan object id dari mongodb params nya ',
			});
		}

		const deletedReview = await deleteReviewById(req.params.id);

		if (!deleteReview || !deleteReview.length) {
			return res.status(404).json({ message: 'gaada review nya puh' }).end();
		}

		res.status(200).json({ message: 'deleted sukses puh', deleteReview });
	} catch (error) {
		console.error(error);
	}
};

export {
	getReviewByProduct,
	getReviewByUser,
	getReviews,
	createReview,
	updateReview,
	deleteReview,
	getReviewByProductUser,
};
