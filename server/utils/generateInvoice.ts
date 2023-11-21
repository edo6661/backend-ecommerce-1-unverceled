const generateRandomNumber = (min, max) => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generateInvoiceNumber = () => {
	const year = new Date().getFullYear();
	const month = (new Date().getMonth() + 1).toString().padStart(2, '0');

	const randomLastDigit = generateRandomNumber(1, 999);

	const invoiceNumber = `INV-${year}-${month}-${randomLastDigit
		.toString()
		.padStart(3, '0')}`;

	return invoiceNumber;
};

export default generateInvoiceNumber;
