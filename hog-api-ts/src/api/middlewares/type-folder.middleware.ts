import { typeUpload } from "@/constants/type-upload.constant";
import { Request, Response, NextFunction } from "@/types/express";

export class TypeUpload {
	static get(type: typeUpload) {
		return (req: Request, res: Response, next: NextFunction) => {
			req.typeUpload = type;
			next();
		};
	}
}
