import express, { Router } from "express";
import { CommonController } from "@/api/controllers/common.controller";

export class CommonRoute {
	static router: Router = express.Router();

	static apply(app: Router) {
		app.use("/api", this.router);
	}
}
