const calculateTotal = (items) => {
	let total = 0;

	for (const item of items) {
		if (item.isChecked) {
			total += item.quantity * item.productId.price;
		}
	}
	return total;
};

export default calculateTotal;
