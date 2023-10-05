import dotenv from "dotenv";
import path from "path";

dotenv.config({
	path: path.resolve(__dirname, "../../.dev.env"),
});

export const S3_CONFIG = {
	S3_ACCESS_KEY: process.env.S3_ACCESS_KEY as string,
	S3_SECRET_KEY: process.env.S3_SECRET_KEY as string,
	S3_ENDPOINT: process.env.S3_ENDPOINT as string,
	S3_BUCKET: process.env.S3_BUCKET as string,
	S3_REGION: process.env.S3_REGION as string,
};
