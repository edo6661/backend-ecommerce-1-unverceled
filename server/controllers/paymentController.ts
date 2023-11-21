import { Request, Response } from 'express';
import midtransClient from 'midtrans-client';
import { getUserById } from '../models/UsersSchema';
import { postPayment } from '../models/PaymentModel';

const createPayment = async (req: Request, res: Response) => {
	try {
		const { order_id, gross_amount } = req.body;
		if (!order_id || !gross_amount) {
			return res.status(404).json({ message: 'semua field required puh' });
		}
		const snap = new midtransClient.Snap({
			isProduction: process.env.NODE_ENV !== 'development',
			serverKey: process.env.SERVER_KEY,
			clientKey: process.env.CLIENT_KEY,
		});

		const user = await getUserById(req.user.id.toString());
		if (!user) {
			res.status(404).json({ message: 'gaada user puh' });
		}
		const param = {
			transaction_details: {
				order_id,
				gross_amount,
			},
			customer_details: {
				email: user.email,
				address: user.address,
				phone: user.phone,
			},
		};

		snap.createTransaction(param).then((transaction) => {
			const token = transaction.token;

			const payment = postPayment({
				transaction_details: {
					order_id,
					gross_amount,
				},
				customer_details: {
					email: user.email,
					address: user.address,
					phone: user.phone,
				},
				transaction_token: token,
				userId: req.user.id,
			});

			return res
				.status(200)
				.json({ message: 'sukses puh', transaction, token });
		});
	} catch (error) {
		console.error(error);
	}
};
const getPayment = (req: Request, res: Response) => {
	res.status(200).json('getPayment');
};
const updatePayment = (req: Request, res: Response) => {
	res.status(200).json('updatePayment');
};
const deletePayment = (req: Request, res: Response) => {
	res.status(200).json('deletePayment');
};

export { createPayment, getPayment, updatePayment, deletePayment };
