import { S3 } from "@aws-sdk/client-s3";

export interface UploadFileI {
	key: string;
	filename: string;
}

export interface S3ServiceI {
	s3: S3;
	uploadFile: ({ key, filename }: UploadFileI) => Promise<void>;
	getFileUrl: (key: string) => Promise<string | undefined>;
}
