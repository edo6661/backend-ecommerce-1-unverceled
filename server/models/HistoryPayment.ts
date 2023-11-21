import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
	finish_redirect_url: {
		type: String,
		required: true,
	},
	fraud_status: {
		type: String,
		required: true,
	},
	gross_amount: {
		type: String,
		required: true,
	},
	order_id: {
		type: String,
		required: true,
	},
	payment_type: {
		type: String,
		required: true,
	},
	pdf_url: {
		type: String,
		required: true,
	},
	status_code: {
		type: String,
		required: true,
	},
	status_message: {
		type: String,
		required: true,
	},
	transaction_id: {
		type: String,
		required: true,
	},
	transaction_status: {
		type: String,
		required: true,
	},
	transaction_time: {
		type: String,
		required: true,
	},
	va_numbers: [
		{
			bank: {
				type: String,
				required: true,
			},
			va_number: {
				type: String,
				required: true,
			},
		},
	],
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},
});

const historyModel = mongoose.model('History', paymentSchema);

const postHistoryPayment = (values: Record<string, any>) =>
	new historyModel(values).save();
const getHistoryPaymentById = (id: string) => historyModel.findById(id);

const getHistoryPaymentByUserId = (userId: string) =>
	historyModel.findById(userId);

const deleteHistoryPaymentById = (id: string) =>
	historyModel.findByIdAndDelete(id);
export {
	postHistoryPayment,
	getHistoryPaymentById,
	getHistoryPaymentByUserId,
	deleteHistoryPaymentById,
};
export default historyModel;
