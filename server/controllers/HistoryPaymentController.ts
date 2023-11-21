import { Request, Response } from 'express';
import { postHistoryPayment } from '../models/HistoryPayment';

const getById = async (req: Request, res: Response) => {
	res.status(200).json('getById');
};
const getByUserId = async (req: Request, res: Response) => {
	res.status(200).json('getByUserId');
};
const createHistoryPayment = async (req: Request, res: Response) => {
	try {
		if (!req.body) {
			res.status(404).json({ message: 'required puh' });
		}
		const newPayment = await postHistoryPayment(req.body);
		res.status(201).json({ message: 'Pembayaran berhasil dibuat', newPayment });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Gagal membuat pembayaran' });
	}
};
const deleteById = async (req: Request, res: Response) => {
	res.status(200).json('deleteById');
};

export { getById, getByUserId, createHistoryPayment, deleteById };
