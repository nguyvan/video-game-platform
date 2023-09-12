import dotenv from "dotenv";

dotenv.config();

export const RSA_PRIVATE_KEY = process.env.RSA_PRIVATE_KEY as string;
export const RSA_PUBLIC_KEY = process.env.RSA_PUBLIC_KEY as string;
