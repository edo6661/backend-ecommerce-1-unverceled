import express from 'express';
const errorHandler = async (
	err: Error,
	req: express.Request,
	res: express.Response,
	next: express.NextFunction
) => {
	const status = res.statusCode ? res.statusCode : 500;

	res.status(status).json({
		message: err.message,
		stack: process.env.NODE_ENV === 'production' ? null : err.stack,
		isError: true,
	});
};

export default errorHandler;
