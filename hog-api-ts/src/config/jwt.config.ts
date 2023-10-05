import dotenv from "dotenv";
import path from "path";

dotenv.config({
	path: path.resolve(__dirname, "../../.dev.env"),
});

export const RSA_PRIVATE_KEY = process.env.RSA_PRIVATE_KEY as string;
export const RSA_PUBLIC_KEY = process.env.RSA_PUBLIC_KEY as string;
