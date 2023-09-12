import dotenv from "dotenv";

dotenv.config();

export const PEPPER_TOKEN = process.env.PEPPER_TOKEN as string;
