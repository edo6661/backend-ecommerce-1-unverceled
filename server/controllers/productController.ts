import express from 'express';
import mongoose from 'mongoose';
import {
	deleteProductById,
	getAllProducts,
	getProductByUser,
	getProductByid,
	postProduct,
	productModel,
} from '../models/ProductSchema';


const getProducts = async (req: express.Request, res: express.Response) => {
	const ITEMS_PER_PAGE = 8;
	const page = +req.query.page || 1;
	let brand = req.query.brand || 'All';
	let category = req.query.category || 'All';
	const search = req.query.search || '';

	let query: { [key: string]: any } = { quantity: { $gt: 0 } };

	try {
		const skip = (page - 1) * ITEMS_PER_PAGE;
		const countPromise = productModel.estimatedDocumentCount(query);
		let itemsPromise = productModel
			.find({
				name: { $regex: search, $options: 'i' },
				...(brand !== 'All' ? { brand: { $regex: brand, $options: 'i' } } : {}),
				...(category !== 'All'
					? { category: { $regex: category, $options: 'i' } }
					: {}),
			})
			.sort({ createdAt: -1 })
			.limit(ITEMS_PER_PAGE)
			.skip(skip);

		const [count, items] = await Promise.all([countPromise, itemsPromise]);

		const pageCount = Math.ceil(count / ITEMS_PER_PAGE);
		return res.status(200).json({
			pagination: {
				count,
				pageCount,
			},
			items,
		});
	} catch (error) {
		console.error(error);
	}
};


const getProductNoQuantity = async (
	req: express.Request,
	res: express.Response
) => {
	let products = await getAllProducts.clone();
	if (!products.length) {
		return res
			.status(400)
			.json({ message: 'gaada products puh utk saat ini ' })
			.end();
	}
	products = products.filter((product) => product.quantity < 1);

	return res.status(200).json(products);
};

const getProduct = async (req: express.Request, res: express.Response) => {
	try {
		if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
			return res.status(400).json({
				message:
					'ID produk tidak valid puh , bukan object id dari mongodb params nya ',
			});
		}
		const product = await getProductByid(req.params.id);

		if (!product) {
			return res.status(404).json({ message: 'gaada product nya puh' }).end();
		}

		return res.status(200).json(product).end();
	} catch (error) {
		console.error(error);
	}
};

const getProductUser = async (req: express.Request, res: express.Response) => {
	if (!mongoose.Types.ObjectId.isValid(req.user.id)) {
		return res
			.status(400)
			.json({ message: 'userId harus type of mongoDb object id puh' });
	}

	const product = await getProductByUser(req.user.id.toString());
	if (!product || !product.length) {
		return res.status(400).json({ message: 'gapunya product puh' });
	}

	return res.status(200).json(product);
};
const createProduct = async (req: express.Request, res: express.Response) => {
	try {
		const { name, description, price, quantity, category, brand, photo } =
			req.body;

		if (!name || !price || !quantity || !photo.length) {
			return res
				.status(400)
				.json({ message: 'name price quantity photo are required puh' });
		}
		const products = await postProduct({
			userId: req.user.id,
			name,
			description,
			price,
			quantity,
			category,
			brand,
			photo,
		});

		return res.status(201).json(products).end();
	} catch (error) {
		console.error(error);
	}
};
const updateProduct = async (req: express.Request, res: express.Response) => {
	const { name, description, price, quantity, category, brand, photo } =
		req.body;

	if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
		return res.status(400).json({
			message:
				'ID produk tidak valid puh , bukan object id dari mongodb params nya ',
		});
	}

	const product = await getProductByid(req.params.id);

	if (!product) {
		return res.status(404).json({ message: 'produk gaada puh ' });
	}

	if (name) {
		product.name = name;
	}
	if (description) {
		product.description = description;
	}
	if (price) {
		if (isNaN(price)) {
			return res.status(400).json({
				message: 'price harus number puh',
			});
		}
		if (price <= 0) {
			return res.status(400).json({
				message: 'price harus berupa angka positif puh',
			});
		}
		product.price = price;
	}
	if (quantity) {
		if (isNaN(quantity)) {
			return res.status(400).json({
				message: 'quantity harus number puh',
			});
		}
		if (quantity <= 0) {
			return res.status(400).json({
				message: 'quantity harus berupa angka positif puh',
			});
		}
		product.quantity = quantity;
	}
	if (category) {
		product.category = category;
	}
	if (brand) {
		product.brand = brand;
	}
	if (photo) {
		product.photo = photo;
	}

	await product.save();

	res.status(200).json(product);
};
const deleteProduct = async (req: express.Request, res: express.Response) => {
	try {
		if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
			return res.status(400).json({
				message:
					'ID produk tidak valid puh , bukan object id dari mongodb params nya ',
			});
		}
		const productDeleted = await deleteProductById(req.params.id);

		if (!productDeleted) {
			return res.status(404).json({ message: 'gaada product nya puh' }).end();
		}

		return res.status(200).json(productDeleted);
	} catch (error) {
		console.error(error);
	}
};

export {
	createProduct, deleteProduct, getProduct, getProductNoQuantity, getProductUser, getProducts, updateProduct
};

