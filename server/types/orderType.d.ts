import { Document, Types } from 'mongoose';
interface OrderProduct {
	productId: Types.ObjectId;
	quantity: number;
}

interface OrderDocument extends Document {
	userId: Types.ObjectId;
	products: OrderProduct[];
	totalAmount: number;
	status: string;
	deliveryMethod?: string;
	paymentMethod?: string;
	cardNumber?: string;
	estimationDeliveryDate?: Date;
	shippingAddress?: string;
	invoiceNumber?: string;
}
