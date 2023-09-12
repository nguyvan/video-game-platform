import dotenv from "dotenv";

dotenv.config();

export const DATABASE_CONFIG = {
	URI_MONGODB_CONNECTION: process.env.URI_MONGODB_CONNECTION as string,
	URI_REDIS_CONNECTION: process.env.URI_REDIS_CONNECTION as string,
};
