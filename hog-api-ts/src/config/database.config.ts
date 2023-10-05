import dotenv from "dotenv";
import path from "path";

dotenv.config({
	path: path.resolve(__dirname, "../../.dev.env"),
});

export const DATABASE_CONFIG = {
	URI_MONGODB_CONNECTION: process.env.URI_MONGODB_CONNECTION as string,
	URI_REDIS_CONNECTION: process.env.URI_REDIS_CONNECTION as string,
};
