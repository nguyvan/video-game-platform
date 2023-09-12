import { typeUpload } from "@/constants/type-upload.constant";
import { ConnectionI } from "@/database/interface/connection.interface";
import { S3ServiceI } from "@/services/s3/s3.interface";
import {
	Request as RequestI,
	Response as ResponseI,
	NextFunction as NextFunctionI,
} from "express";

export interface Request extends RequestI {
	user?: { id: string };
	db?: ConnectionI;
	s3?: S3ServiceI;
	typeUpload?: typeUpload;
}

export interface Response extends ResponseI {}

export interface NextFunction extends NextFunctionI {}
