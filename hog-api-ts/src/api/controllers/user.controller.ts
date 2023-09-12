import { appError } from "@/constants/error.constant";
import { typeNotification } from "@/database/constant/config.mongo";
import { AppError } from "@/errors/app.error";
import { NotificationRepository } from "@/repository/models/notification.repository";
import { PostRepository } from "@/repository/models/post.repository";
import { UserRepository } from "@/repository/models/user.repository";
import { Request, Response, NextFunction } from "@/types/express";
import { StatusCodes } from "http-status-codes";
import { container } from "@/config/inversify.config";
import { SocketServiceI } from "@/services/socket/socket.interface";
import { INJECTION_TYPE } from "@/constants/injection.constant";

export class UserController {
	static async getUsers(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.user!;
			const { skip, search } = req.query as unknown as {
				skip: number;
				search?: string;
			};
			const database = req.db!;
			const userRepository = new UserRepository(database);
			if (!!search) {
				const users = await userRepository.getBySearch({
					search: search as string,
					skip,
					withPassword: false,
					id,
				});
				return res.status(StatusCodes.OK).json({ users });
			}
			const users = await userRepository.getOtherUsers({ id, skip });
			return res.status(StatusCodes.OK).json({ users });
		} catch (err) {
			next(err);
		}
	}

	static async getUserById(req: Request, res: Response, next: NextFunction) {
		try {
			const id: string =
				(req.query.id as string | undefined) || req.user!.id;
			const database = req.db!;
			const userRepository = new UserRepository(database);
			const user = await userRepository.getById(id);
			return res.status(StatusCodes.OK).json({ user });
		} catch (err) {
			next(err);
		}
	}

	static async createPost(req: Request, res: Response, next: NextFunction) {
		try {
			const database = req.db!;
			const { id } = req.user!;
			const { title }: { title: string } = req.body as { title: string };
			const urlImage: string = (req.files as any[])?.find(
				(value) => value.metadata.type === "poster"
			)?.key;
			const urlVideo: string = (req.files as any[])?.find(
				(value) => value.metadata.type === "video"
			)?.key;
			const postRepository = new PostRepository(database);
			await postRepository.create({
				idUser: id,
				title,
				urlImage,
				urlVideo,
			});
			return res.status(StatusCodes.OK).json({});
		} catch (err) {
			next(err);
		}
	}

	static async createComment(
		req: Request,
		res: Response,
		next: NextFunction
	) {
		try {
			const database = req.db!;
			const { id } = req.user!;
			const { idPost, content } = req.body;
			const userRepository = new UserRepository(database);
			const postRepository = new PostRepository(database);
			const notificationRepository = new NotificationRepository(database);
			const socketService = container.get<SocketServiceI>(
				INJECTION_TYPE.SOCKET_SERVICE
			);
			const post = await postRepository.getById({
				id: idPost,
				idOwnUser: id,
			});
			if (!post) {
				throw new AppError({
					name: appError.NOT_FOUND,
					message: `post ${idPost} not found`,
					details: `post ${idPost} not found`,
					statusCode: StatusCodes.NOT_FOUND,
					origin: this.createComment.name,
				});
			}

			await userRepository.postComment({ idUser: id, idPost, content });

			const date = new Date();
			const user = (await userRepository.getById(id))!;
			const type = typeNotification.COMMENT;
			const nbPeople = await notificationRepository.getNumberPeople({
				idUser: id,
				idPost,
				type,
			});
			const title = `${user.username} ${
				nbPeople ? `and ${nbPeople} ` : ""
			}commented to your post: ${content}`;

			await notificationRepository.upsertNotif({
				idUser: post.idUser,
				idSender: id,
				idPost,
				type,
				title,
			});

			socketService.sendNotif({
				user,
				date,
				type,
				title,
				receivers: [post.idUser.toString()],
			});

			return res.status(StatusCodes.OK).json({});
		} catch (err) {
			next(err);
		}
	}

	static async getComment(req: Request, res: Response, next: NextFunction) {
		try {
			const database = req.db!;
			const { idPost, skip } = req.query as unknown as {
				idPost: string;
				skip?: number;
			};
			const postRepository = new PostRepository(database);
			const comments = await postRepository.getComment(
				idPost as string,
				skip
			);
			return res.status(StatusCodes.OK).json({ comments });
		} catch (err) {
			next(err);
		}
	}

	static async getPosts(req: Request, res: Response, next: NextFunction) {
		try {
			const database = req.db!;
			const { id } = req.user!;
			const { skip, isAll, idUser } = req.query as {
				skip?: number;
				isAll?: string;
				idUser?: string;
			};
			const postRepository = new PostRepository(database);
			const posts = await postRepository.get({
				idUser: isAll === "true" ? undefined : idUser ? idUser : id,
				skip,
				idOwnUser: id,
			});
			return res.status(StatusCodes.OK).json({ posts });
		} catch (err) {
			next(err);
		}
	}

	static async getNotifs(req: Request, res: Response, next: NextFunction) {
		try {
			const database = req.db!;
			const { id } = req.user!;
			const { skip, isLiked } = req.query as {
				skip?: number;
				isLiked?: string;
			};
			const userRepository = new UserRepository(database);
			const notifs = await userRepository.getAllNotif({
				id,
				skip,
				isLiked: isLiked === "true",
			});
			return res.status(StatusCodes.OK).json({ notifs });
		} catch (err) {
			next(err);
		}
	}

	static async getPostById(req: Request, res: Response, next: NextFunction) {
		try {
			const database = req.db!;
			const { id } = req.user!;
			const { idPost } = req.query;
			const postRepository = new PostRepository(database);
			const post = await postRepository.getById({
				idUser: id,
				id: idPost as string | undefined | null,
				idOwnUser: id,
			});
			return res.status(StatusCodes.OK).json({ post });
		} catch (err) {
			next(err);
		}
	}

	static async like(req: Request, res: Response, next: NextFunction) {
		try {
			const database = req.db!;
			const { id } = req.user!;
			const { idPost } = req.body;
			const userRepository = new UserRepository(database);
			const postRepository = new PostRepository(database);
			const notificationRepository = new NotificationRepository(database);
			const socketService = container.get<SocketServiceI>(
				INJECTION_TYPE.SOCKET_SERVICE
			);

			const post = await postRepository.getById({
				id: idPost,
				idOwnUser: id,
			});
			if (!post) {
				throw new AppError({
					name: appError.NOT_FOUND,
					message: `post ${idPost} not found`,
					details: `post ${idPost} not found`,
					statusCode: StatusCodes.NOT_FOUND,
					origin: this.createComment.name,
				});
			}

			await userRepository.likePost({
				idUser: id,
				idPost: idPost as string,
			});

			const isLiked = await userRepository.getIsLiked({
				idUser: id,
				idPost,
			});

			if (isLiked) {
				const date = new Date();
				const user = (await userRepository.getById(id))!;
				const type = typeNotification.LIKE;
				const nbPeople = await notificationRepository.getNumberPeople({
					idUser: id,
					idPost,
					type,
				});
				const title = `${user.username} ${
					nbPeople ? `and ${nbPeople} ` : ""
				}liked your post`;

				await notificationRepository.upsertNotif({
					idUser: post.idUser,
					idSender: id,
					idPost,
					type,
					title,
				});

				socketService.sendNotif({
					user,
					date,
					type,
					title,
					receivers: [post.idUser.toString()],
				});
			}

			return res.status(StatusCodes.OK).json({});
		} catch (err) {
			next(err);
		}
	}

	static async getNumberNotif(
		req: Request,
		res: Response,
		next: NextFunction
	) {
		try {
			const database = req.db!;
			const { id } = req.user!;
			const { isLiked } = req.query;
			const userRepository = new UserRepository(database);
			const nbNotif = await userRepository.getNumberNotif(
				id,
				isLiked === "true"
			);
			return res.status(StatusCodes.OK).json({ nbNotif });
		} catch (err) {
			next(err);
		}
	}

	static async viewNotif(req: Request, res: Response, next: NextFunction) {
		try {
			const database = req.db!;
			const { id } = req.user!;
			const { isLiked } = req.body;
			const notificationRepository = new NotificationRepository(database);
			await notificationRepository.updateView(id, isLiked);
			return res.status(StatusCodes.OK).json({});
		} catch (err) {
			next(err);
		}
	}

	static async clickNotif(req: Request, res: Response, next: NextFunction) {
		try {
			const database = req.db!;
			const { id } = req.user!;
			const { isLiked } = req.body;
			const notificationRepository = new NotificationRepository(database);
			await notificationRepository.updateClick(id, isLiked);
			return res.status(StatusCodes.OK).json({});
		} catch (err) {
			next(err);
		}
	}

	static async updateProfile(
		req: Request,
		res: Response,
		next: NextFunction
	) {
		try {
			const database = req.db!;
			const { id } = req.user!;
			const { username, bio } = req.body;
			const urlImage: string = (req.files as any[])?.find(
				(value) => value.metadata.type === "avatar"
			)?.key;
			const userRepository = new UserRepository(database);
			const isExisted = !!(await userRepository.getByUsername(username));
			if (isExisted) {
				throw new AppError({
					name: appError.CONFLICT,
					message: `username ${username} is already used`,
					details: `username ${username} is already used`,
					statusCode: StatusCodes.CONFLICT,
					origin: this.createComment.name,
				});
			}
			await userRepository.updateInfo({ id, urlImage, username, bio });
			return res.status(StatusCodes.OK).json({});
		} catch (err) {
			next(err);
		}
	}

	static async sharePost(req: Request, res: Response, next: NextFunction) {
		try {
			const database = req.db!;
			const { id } = req.user!;
			const { idReceivers, idPost } = req.body as {
				idReceivers: string[];
				idPost: string;
			};
			const userRepository = new UserRepository(database);
			const postRepository = new PostRepository(database);
			const notificationRepository = new NotificationRepository(database);
			const socketService = container.get<SocketServiceI>(
				INJECTION_TYPE.SOCKET_SERVICE
			);
			const post = await postRepository.getById({
				id: idPost,
				idOwnUser: id,
			});
			if (!post) {
				throw new AppError({
					name: appError.NOT_FOUND,
					message: `post ${idPost} not found`,
					details: `post ${idPost} not found`,
					statusCode: StatusCodes.NOT_FOUND,
					origin: this.createComment.name,
				});
			}

			const posts = idReceivers.map((idReceiver) => ({
				id,
				idReceiver,
				idPost,
			}));

			const date = new Date();
			const type = typeNotification.GET_SHARE;
			const nbPeople = await notificationRepository.getNumberPeople({
				idUser: id,
				idPost,
				type,
			});
			const user = (await userRepository.getById(id))!;
			const title = `${user.username} ${
				nbPeople ? `and ${nbPeople} ` : ""
			}shared your post`;

			await userRepository.sharePost(posts);

			await notificationRepository.upsertNotif({
				idUser: post.idUser,
				idSender: id,
				idPost,
				type,
				title,
			});
			socketService.sendNotif({
				user,
				date,
				type,
				title,
				receivers: [post.idUser.toString()],
			});

			for (let idReceiver of idReceivers) {
				const shareType = typeNotification.SHARE;
				const shareTitle = `${user.username} shared a post with you`;
				const isExisted = !!(await userRepository.getById(idReceiver));
				if (isExisted) {
					await notificationRepository.upsertNotif({
						idUser: idReceiver,
						idSender: id,
						idPost,
						type: shareType,
						title: shareTitle,
					});
				}
			}
			socketService.sendNotif({
				user,
				date,
				type: typeNotification.SHARE,
				title: `${user.username} shared a post with you`,
				receivers: idReceivers,
			});

			return res.status(StatusCodes.OK).json({});
		} catch (err) {
			next(err);
		}
	}
}
