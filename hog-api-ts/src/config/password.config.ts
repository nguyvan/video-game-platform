import dotenv from "dotenv";
import path from "path";

dotenv.config({
	path: path.resolve(__dirname, "../../.dev.env"),
});

export const PEPPER_TOKEN = process.env.PEPPER_TOKEN as string;
