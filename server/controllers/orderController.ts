import express from 'express';
import {
	deletingOrder,
	getAllOrders,
	getOrderByCartId,
	getOrderByUserId,
	orderModel,
	postOrder,
} from '../models/OrderSchema';
import {
	deleteProductCartChecked,
	getCartByUserId,
} from '../models/CartSchema';
import calculateTotal from '../helpers/calculateTotalsCart';
import generateInvoiceNumber from '../utils/generateInvoice';

const getOrders = async (req: express.Request, res: express.Response) => {
	const orders = await getAllOrders().clone();
	if (!orders.length) {
		return res.status(404).json({ message: 'gaada orders nya puh' }).end();
	}
	res.status(200).json(orders);
};
const getOrderByUser = async (req: express.Request, res: express.Response) => {
	if (!req.user.id) {
		return res.status(404).json({ message: 'gaada user puh' });
	}
	const orders = await getOrderByUserId(req.user.id.toString());
	if (!orders || !orders.length) {
		return res.status(404).json({ message: 'gaada orders nya puh' }).end();
	}
	res.status(200).json(orders);
};
const getOrderById = async (req: express.Request, res: express.Response) => {
	const orders = await getOrderByCartId(req.params.id);
	if (!orders) {
		return res.status(404).json({ message: 'gaada orders nya puh' }).end();
	}
	res.status(200).json(orders);
};

// TODO address bikin required kalo user belom punya address di userSchema
const createOrder = async (req: express.Request, res: express.Response) => {
	try {
		const { deliveryMethod, shippingAddress } = req.body;
		const productCart = await getCartByUserId(req.user.id.toString());

		if (!productCart) {
			return res.status(404).json({ message: 'cart nya kosong kali puh ' });
		}

		const checkedProduct = productCart.items.filter((item) => item.isChecked);

		if (checkedProduct.length === 0) {
			return res
				.status(400)
				.json({ message: 'gaada product yang dipilih puh' });
		}

		if (!req.user.id || !deliveryMethod) {
			return res
				.status(400)
				.json({ message: 'semua fields required puh kecuali alamat' });
		}

		const newOrder = await postOrder({
			userId: req.user.id,
			products: checkedProduct.map((item) => ({
				productId: item.productId,
				quantity: item.quantity,
			})),
			totalAmount: calculateTotal(checkedProduct),
			status: 'Pending',
			deliveryMethod,
			invoiceNumber: generateInvoiceNumber(),
			shippingAddress: shippingAddress,
		});

		await deleteProductCartChecked();

		res.status(201).json({ message: 'pesanan berhasil dibuat puh', newOrder });
	} catch (error) {
		res.status(500).json('server internal error');
		console.error(error);
	}
};

const buy = async (req: express.Request, res: express.Response) => {
	const { productId, quantity, deliveryMethod, shippingAddress, totalAmount } =
		req.body;

	if (
		!quantity ||
		!deliveryMethod ||
		!shippingAddress ||
		!totalAmount ||
		!productId
	) {
		return res.status(400).json({ message: 'all fields required puh' });
	}

	const newOrder = await postOrder({
		userId: req.user.id,
		products: {
			productId,
			quantity,
		},
		totalAmount,
		status: 'Pending',
		invoiceNumber: generateInvoiceNumber(),
		shippingAddress,
		deliveryMethod,
	});

	return res.status(201).json(newOrder);
};

const updateOrder = async (req: express.Request, res: express.Response) => {
	try {
		const {
			status,
			deliveryMethod,
			paymentMethod,
			cardNumber,
			estimationDeliveryDate,
			shippingAddress,
		} = req.body;

		const hasChanges =
			(status !== undefined && status !== '') ||
			(deliveryMethod !== undefined && deliveryMethod !== '') ||
			(paymentMethod !== undefined && paymentMethod !== '') ||
			(cardNumber !== undefined && cardNumber !== '') ||
			(estimationDeliveryDate !== undefined && estimationDeliveryDate !== '') ||
			(shippingAddress !== undefined && shippingAddress !== '');

		if (!hasChanges) {
			return res.status(400).json({
				message: 'tidak ada perubahan field yang disubmit puh',
			});
		}

		const order = await getOrderByCartId(req.params.id);

		if (!order) {
			return res.status(400).json({ message: 'gaada order nya puh' });
		}

		if (order.status) {
			order.status = status;
		}
		if (deliveryMethod && deliveryMethod !== '') {
			order.deliveryMethod = deliveryMethod;
		}

		if (order.paymentMethod) {
			order.paymentMethod = paymentMethod;
		}
		if (order.cardNumber) {
			order.cardNumber = cardNumber;
		}
		if (order.estimationDeliveryDate) {
			order.estimationDeliveryDate = estimationDeliveryDate;
		}
		if (order.shippingAddress) {
			order.shippingAddress = shippingAddress;
		}
		await order.save();

		res.status(200).json({ message: 'updated suceesfully' });
	} catch (error) {
		console.error(error);
		res.status(500).json('server internal error');
	}
};
const deleteOrder = async (req: express.Request, res: express.Response) => {
	const order = await getOrderByUserId(req.user.id.toString());
	if (!order) {
		return res.status(400).json({ message: 'gaada order nya puh' });
	}

	await deletingOrder(req.params.id);

	res.status(200).json({ message: 'delete sukses puh' });
};

const payingOrder = async (req: express.Request, res: express.Response) => {
	const orders = await getOrderByCartId(req.params.id);
	if (!orders) {
		return res.status(404).json({ message: 'gaada orders nya puh' }).end();
	}
	const updatedStatus = await orderModel.findById(req.params.id);

	updatedStatus.status = 'Processing';

	await updatedStatus.save();

	return res.status(200).json({ message: 'sukses bayar', updatedStatus });
};

export {
	getOrderByUser,
	getOrders,
	createOrder,
	updateOrder,
	deleteOrder,
	payingOrder,
	getOrderById,
	buy,
};
