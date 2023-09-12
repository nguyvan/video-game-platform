import express, { Router } from "express";
import { UserController } from "@/api/controllers/user.controller";
import { authMiddleware } from "@/api/middlewares/auth.middleware";
import { TypeUpload } from "@/api/middlewares/type-folder.middleware";
import { typeUpload } from "@/constants/type-upload.constant";
import { upload } from "@/api/middlewares/upload-file.middleware";

export class UserRoute {
	static router: Router = express.Router();

	static apply(app: Router) {
		app.use("/api/user", this.router);
		this.router.get("/", authMiddleware, UserController.getUsers);
		this.router.get("/profile", authMiddleware, UserController.getUserById);
		this.router.post(
			"/create/post",
			authMiddleware,
			TypeUpload.get(typeUpload.POST),
			upload.array("files"),
			UserController.createPost
		);
		this.router.post(
			"/create/comment",
			authMiddleware,
			UserController.createComment
		);

		this.router.get("/comments", authMiddleware, UserController.getComment);

		this.router.get("/posts", authMiddleware, UserController.getPosts);

		this.router.get("/post", authMiddleware, UserController.getPostById);

		this.router.get("/notifs", authMiddleware, UserController.getNotifs);

		this.router.post("/like", authMiddleware, UserController.like);

		this.router.get(
			"/notif/number",
			authMiddleware,
			UserController.getNumberNotif
		);

		this.router.patch(
			"/notif/view",
			authMiddleware,
			UserController.viewNotif
		);

		this.router.patch(
			"/notif/click",
			authMiddleware,
			UserController.clickNotif
		);

		this.router.patch(
			"/profile/update",
			authMiddleware,
			TypeUpload.get(typeUpload.AVATAR),
			upload.array("files"),
			UserController.updateProfile
		);

		this.router.post("/share", authMiddleware, UserController.sharePost);
	}
}
