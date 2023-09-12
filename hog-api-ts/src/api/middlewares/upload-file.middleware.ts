import { S3_CONFIG } from "@/config/s3.config";
import { S3Service } from "@/services/s3";
import multer from "multer";
import multerS3 from "multer-s3";
import { Request } from "@/types/express";
import { typeUpload } from "@/constants/type-upload.constant";
import crypto from "crypto";
import mimetypes from "mime-types";
import { AppError } from "@/errors/app.error";
import { appError } from "@/constants/error.constant";
import { StatusCodes } from "http-status-codes";

export const upload = multer({
	storage: multerS3({
		s3: S3Service.s3,
		bucket: S3_CONFIG.S3_BUCKET,
		metadata: (req: Request, file, cb) => {
			if (req.typeUpload === typeUpload.AVATAR) {
				cb(null, { type: "avatar" });
			} else if (req.typeUpload === typeUpload.POST) {
				if (
					["image/png", "image/jpeg", "image/png"].includes(
						file.mimetype
					)
				) {
					cb(null, { type: "poster" });
				} else if (file.mimetype === "video/mp4") {
					cb(null, { type: "video" });
				}
			}
		},
		key: (req: Request, file, cb) => {
			const date: string = Date.now().toString();
			const id: string = req.user?.id as string;
			const uuid: string = crypto.randomUUID();
			const extension: string = mimetypes.extension(
				file.mimetype
			) as string;
			const key: string = `${id}/${uuid}_${date}.${extension}`;
			if (req.typeUpload === typeUpload.AVATAR) {
				cb(null, `avatar/${key}`);
			} else if (req.typeUpload === typeUpload.POST) {
				if (
					["image/png", "image/jpeg", "image/png"].includes(
						file.mimetype
					)
				) {
					cb(null, `posts/poster/${key}`);
				} else if (file.mimetype === "video/mp4") {
					cb(null, `posts/video/${key}`);
				} else {
					cb(
						new AppError({
							name: appError.INVALID_FILE,
							message: "your type of document is not supported",
							details: "your type of document is not supported",
							statusCode: StatusCodes.NOT_IMPLEMENTED,
							origin: "multer upload",
						})
					);
				}
			} else {
				cb(
					new AppError({
						name: appError.INVALID_FILE,
						message: "type upload is not defined",
						details: "type upload is not defined",
						statusCode: StatusCodes.NOT_IMPLEMENTED,
						origin: "multer upload",
					})
				);
			}
		},
	}),
});
