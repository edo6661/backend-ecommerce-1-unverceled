import express from 'express';

const userPermission = (
	req: express.Request,
	res: express.Response,
	next: express.NextFunction
) => {
	if (req.user.roles == 'user') {
		return res.status(403).json({
			message:
				'ga punya permission untuk buat prouduct karena sepuh hanya user',
		});
	}
	next();
};
const ownerPermission = (
	req: express.Request,
	res: express.Response,
	next: express.NextFunction
) => {
	if (
		req.user.roles == 'admin' ||
		req.user.roles == 'user' ||
		req.user.roles == 'seller'
	) {
		return res.status(403).json({
			message:
				'ga punya permission untuk ini, karena roles sepuh dibawah owner',
		});
	}
	next();
};
const adminPermission = (
	req: express.Request,
	res: express.Response,
	next: express.NextFunction
) => {
	if (req.user.roles == 'user' || req.user.roles == 'seller') {
		return res.status(403).json({
			message:
				'ga punya permission untuk ini, karena roles sepuh dibawah admin',
		});
	}
	next();
};

export { userPermission, ownerPermission, adminPermission };
