import express, { Application } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { getService } from "@/api/middlewares/get-service.middleware";
import { AuthRoute } from "./routes/auth.route";
import { CommonRoute } from "./routes/common.route";
import { UserRoute } from "./routes/user.route";
import { DatabaseError } from "@/errors/database.error";
import { AppError } from "@/errors/app.error";
import { StatusCodes } from "http-status-codes";
import { Request, Response } from "@/types/express";

export const configurationApp = () => {
	const app: Application = express();
	app.use(
		cors({
			origin: "http://192.168.1.72",
			credentials: true,
			methods: [
				"POST",
				"PUT",
				"GET",
				"OPTIONS",
				"HEAD",
				"DELETE",
				"PATCH",
			],
			exposedHeaders: ["set-cookie"],
		})
	);
	app.set("trust proxy", 1);
	app.use(bodyParser.json());
	app.use(cookieParser());
	app.use("/*", getService);
	app.disable("x-powered-by");
	AuthRoute.apply(app);
	CommonRoute.apply(app);
	UserRoute.apply(app);
	app.use((err: DatabaseError | AppError, req: Request, res: Response) => {
		if (err instanceof DatabaseError) {
			return res
				.status(StatusCodes.INTERNAL_SERVER_ERROR)
				.json({ message: err.message });
		} else if (err instanceof AppError) {
			return res.status(err?.statusCode).json({ message: err.message });
		}
	});
	return app;
};
