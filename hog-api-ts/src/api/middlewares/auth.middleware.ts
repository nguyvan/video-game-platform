import { Request, Response, NextFunction } from "@/types/express";
import { validateToken } from "@/utils/token.util";

export const authMiddleware = (
	req: Request,
	Response: Response,
	next: NextFunction
) => {
	try {
		const token: string = req.headers.authorization
			?.split(" ")
			.at(1) as string;
		req.user = validateToken(token);
		next();
	} catch (err) {
		return next(err);
	}
};
