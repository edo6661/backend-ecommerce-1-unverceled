import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
	{
		transaction_details: {
			order_id: {
				type: String,
				required: true,
			},
			gross_amount: {
				type: Number,
				required: true,
			},
		},
		customer_details: {
			email: {
				type: String,
				required: true,
				address: {
					type: String,
					required: true,
				},
				phone: {
					type: String,
					required: true,
				},
			},
		},
		transaction_token: {
			type: String,
			required: true,
		},
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

const paymentModel = mongoose.model('Payment', paymentSchema);

const postPayment = (values: Record<string, any>) =>
	new paymentModel(values).save();

export { postPayment };

export default paymentModel;
