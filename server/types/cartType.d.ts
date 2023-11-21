import { Types } from 'mongoose';

interface Cart {
	_id: Types.ObjectId;
	userId: Types.ObjectId;
	items: {
		productId: Types.ObjectId;
		quantity: Number;
	};
	totalPrice: Number;
}

interface CartItem {
	productId: Types.ObjectId;
	quantity: number;
	isChecked: boolean;
}

interface CartDocument {
	userId: Types.ObjectId;
	items: CartItem[];
	totalPrice?: number;
}

export { Cart, CartDocument, CartItem };
