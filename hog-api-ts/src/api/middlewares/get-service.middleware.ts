import { appError } from "@/constants/error.constant";
import { StorageFactory } from "@/database/storage.database";
import { AppError } from "@/errors/app.error";
import { S3Service } from "@/services/s3";
import { Request, Response, NextFunction } from "@/types/express";
import { StatusCodes } from "http-status-codes";

export const getService = async (
	req: Request,
	_: Response,
	next: NextFunction
) => {
	try {
		const db = await StorageFactory.getDatabase("mongo");
		if (db) {
			req.db = db;
		} else {
			await StorageFactory.setDatabase("mongo");
			req.db = await StorageFactory.getDatabase("mongo");
		}
		req.s3 = S3Service;
		next();
	} catch {
		throw new AppError({
			name: appError.SERVICE_NOT_FOUND,
			details: `cannot get service`,
			message: `cannot get service`,
			statusCode: StatusCodes.NOT_FOUND,
			origin: "middleware get service",
		});
	}
};
