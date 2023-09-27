import { S3_CONFIG } from "@/config/s3.config";
import { appError } from "@/constants/error.constant";
import { AppError } from "@/errors/app.error";
import { S3, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { StatusCodes } from "http-status-codes";
import { UploadFileI } from "./s3.interface";
import fs from "fs";

export class S3Service {
	static s3: S3 = new S3({
		credentials: {
			accessKeyId: S3_CONFIG.S3_ACCESS_KEY,
			secretAccessKey: S3_CONFIG.S3_SECRET_KEY,
		},
		endpoint: S3_CONFIG.S3_ENDPOINT,
		region: S3_CONFIG.S3_REGION,
		forcePathStyle: true,
	});

	static async uploadFile({ key, filename }: UploadFileI): Promise<void> {
		try {
			await this.s3.putObject({
				ACL: "private",
				Key: key,
				Bucket: S3_CONFIG.S3_BUCKET,
				Body: fs.createReadStream(filename),
			});
		} catch {
			throw new AppError({
				name: appError.INTERNAL_ERROR,
				details: `cannot upload file`,
				message: `cannot upload file`,
				statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
				origin: this.uploadFile.name,
			});
		}
	}

	static async getFileUrl(key?: string): Promise<string | undefined> {
		try {
			if (key) {
				const command = new GetObjectCommand({
					Bucket: S3_CONFIG.S3_BUCKET,
					Key: key,
				});
				const url = await getSignedUrl(this.s3, command);
				return url.replace("s3:9000", "192.168.1.72/s3");
			}
			return;
		} catch {
			throw new AppError({
				name: appError.INTERNAL_ERROR,
				details: `cannot get file url`,
				message: `cannot get file url`,
				statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
				origin: this.getFileUrl.name,
			});
		}
	}
}
