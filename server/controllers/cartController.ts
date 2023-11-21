import express from 'express';
import {
	cartModel,
	getCartByUserId,
	updateIsCheckedByProductId,
	updateQuantityByProductId,
} from '../models/CartSchema';
import { productModel } from '../models/ProductSchema';
import mongoose from 'mongoose';
import calculateTotal from '../helpers/calculateTotalsCart';
const getCart = async (req: express.Request, res: express.Response) => {
	try {
		if (!req.user.id) {
			console.log(req.user);
			return res.status(404).json({ message: 'user' });
		}
		const cartProduct = await getCartByUserId(req.user.id.toString());
		if (!cartProduct) {
			return res.status(404).json({
				message: `tidak ada products dalam keranjang belanja`,
			});
		}

		const total = calculateTotal(cartProduct.items);
		cartProduct.totalPrice = total;
		cartProduct.save();

		return res.status(200).json(cartProduct);
	} catch (error) {
		console.error(error);
	}
};
const createCart = async (req: express.Request, res: express.Response) => {
	try {
		const { quantity, productId } = req.body;
		if (!req.user.id) {
			return res.status(404).json({ message: 'userid tidak ditemukan puh' });
		}
		if (!productId) {
			return res.status(400).json({ message: ' product id required puh' });
		}

		const productExist = await productModel.exists({ _id: productId });

		if (!productExist) {
			return res
				.status(404)
				.json({ message: 'product dengan id itu ga ditemukan puh' });
		}

		let cart = await getCartByUserId(req.user.id.toString());
		if (!cart) {
			cart = new cartModel({
				userId: req.user.id,
				items: [],
				totalPrice: 0,
			});
		}

		const duplicateProduct = cart.items.find(
			(item) => item.productId._id.toString() == productId
		);

		if (quantity <= 0) {
			return res.status(409).json({ message: 'quantity gaboleh <= 0' });
		}

		if (duplicateProduct || duplicateProduct !== undefined) {
			const newQuantity = duplicateProduct.quantity + 1;
			const updatedQuantity = await updateQuantityByProductId(
				productId,
				newQuantity
			);
			await updatedQuantity.save();
			return res.status(200).json({
				message: 'produk yang ini sudah ada di keranjang jadi + 1 quantity',
				updatedQuantity,
			});
		} else {
			const newItem = {
				productId,
				quantity,
				isChecked: false,
			};

			cart.items.push(newItem);
		}

		const total = calculateTotal(cart.items);
		cart.totalPrice = total;

		await cart.save();
		return res
			.status(201)
			.json({ message: 'sukses menambahkan product ke cart', cart });
	} catch (error) {
		console.error(error);
	}
};

const incrementQuantity = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
			return res
				.status(400)
				.json({ message: 'id harus type of mongoDb id puh' });
		}

		const products = await getCartByUserId(req.user.id.toString());
		if (!products) {
			return res.status(404).json({
				message: 'gaada product tersebut di cart mu puh / cart gaada isinya',
			});
		}

		const productFound = products.items.find(
			(item) => item.productId._id.toString() == req.params.id
		);

		if (!productFound) {
			return res
				.status(404)
				.json({ message: 'gaada product dengan id itu puh' });
		}
		const incrementQuantity = productFound.quantity + 1;

		const updatedQuantity = await updateQuantityByProductId(
			req.params.id,
			incrementQuantity
		);
		// const total = calculateTotal(products.items);
		// products.totalPrice = total;

		await updatedQuantity.save();
		res.status(200).json({
			message: ' quantity ter update ',
			updatedQuan: updatedQuantity,
		});
	} catch (error) {
		console.error(error);
	}
};

const decrementQuantity = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
			return res
				.status(400)
				.json({ message: 'id harus type of mongoDb id puh' });
		}

		const products = await getCartByUserId(req.user.id.toString());

		if (!products) {
			return res.status(404).json({
				message: 'gaada product tersebut di cart mu puh / cart gaada isinya',
			});
		}

		const productFound = products.items.find(
			(item) => item.productId._id.toString() == req.params.id
		);

		if (!productFound) {
			return res
				.status(404)
				.json({ message: 'gaada product dengan id itu puh' });
		}

		const decrementQuantity = productFound.quantity - 1;
		const updatedQuantity = await updateQuantityByProductId(
			req.params.id,
			decrementQuantity
		);
		// const total = calculateTotal(products.items);
		// products.totalPrice = total;

		await updatedQuantity.save();
		res.status(200).json({
			message: ' quantity ter update ',
			updatedQuan: updatedQuantity,
		});
	} catch (error) {
		console.error(error);
	}
};

const updateChecked = async (req: express.Request, res: express.Response) => {
	if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
		return res.status(400).json({ message: 'id harus type of mongoDb id puh' });
	}

	const products = await getCartByUserId(req.user.id.toString());

	if (!products) {
		return res.status(404).json({
			message: 'gaada product tersebut di cart mu puh / cart gaada isinya',
		});
	}

	const productFound = products.items.find(
		(item) => item.productId._id.toString() == req.params.id
	);

	if (!productFound) {
		return res.status(404).json({ message: 'gaada product dengan id itu puh' });
	}

	const updatedChecked = await updateIsCheckedByProductId(
		req.params.id,
		!productFound.isChecked
	);

	// const total = calculateTotal(products.items);
	// products.totalPrice = total;

	updatedChecked.save();
	products.save();

	res.status(200).json({
		message: ' isChecked ter update ',
		updatedCheck: updatedChecked,
	});
};
const deleteCart = async (req: express.Request, res: express.Response) => {
	try {
		if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
			return res
				.status(400)
				.json({ message: 'id harus type of mongoDb id puh' });
		}

		const productsUser = await getCartByUserId(req.user.id.toString());

		if (!productsUser) {
			return res.status(404).json({
				message: 'cart mu gaada isinya puh',
			});
		}

		const productFound = productsUser.items.findIndex(
			(item) => item.productId._id.toString() == req.params.id
		);

		if (productFound == -1) {
			return res.status(404).json({
				message: 'gaada product tersebut di cart mu puh ',
			});
		}

		productsUser.items.splice(productFound, 1);

		// const total = calculateTotal(productsUser.items);
		// productsUser.totalPrice = total;

		await productsUser.save();

		const deletedProduct = productsUser.items[productFound];

		res.status(200).json({ message: 'product deleted', deletedProduct });
	} catch (error) {
		console.error(error);
	}
};

const getTotalPrice = async (req: express.Request, res: express.Response) => {
	const productsUser = await getCartByUserId(req.user.id.toString());

	if (!productsUser) {
		return res.status(404).json({
			message: 'cart mu gaada isinya puh',
		});
	}

	const total = calculateTotal(productsUser.items);
	productsUser.totalPrice = total;
	productsUser.save();
	res.status(200).json(productsUser.totalPrice);
};

export {
	getCart,
	createCart,
	updateChecked,
	decrementQuantity,
	incrementQuantity,
	deleteCart,
	getTotalPrice,
};
