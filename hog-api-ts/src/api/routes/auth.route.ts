import express, { Router } from "express";
import { AuthController } from "@/api/controllers/auth.controller";

export class AuthRoute {
	static router: Router = express.Router();

	static apply(app: Router) {
		app.use("/api/auth", this.router);
		this.router.post("/signup", AuthController.signup);
		this.router.post("/login", AuthController.login);
		this.router.post("/logout", AuthController.logout);
		this.router.post("/refresh_token", AuthController.refreshToken);
	}
}
