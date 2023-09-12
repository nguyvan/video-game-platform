import { ConnectionI } from "@/database/interface/connection.interface";
import {
	CreateUserI,
	GetByIdI,
	GetNotifByIdI,
	GetNotifReturnI,
	GetUserBySearchI,
	LikePostI,
	PostCommentI,
	SharePostI,
	UpdateInfoI,
	UserReturnI,
} from "@/repository/interfaces/user.interface";
import { UserI } from "@/database/mongodb/dto/user.dto";
import { DatabaseError } from "@/errors/database.error";
import { databaseError } from "@/constants/error.constant";
import { generatePassword, generateSalt } from "@/utils/password.util";
import mongoose from "mongoose";
import { CommentI } from "@/database/mongodb/dto/comment.dto";
import { LikeI } from "@/database/mongodb/dto/like.dto";
import { NotificationI } from "@/database/mongodb/dto/notification.dto";
import { typeNotification } from "@/database/constant/config.mongo";
import { LIMIT } from "@/constants/pagination.constant";
import { PostI } from "@/database/mongodb/dto/post.dto";
import { S3Service } from "@/services/s3";
import { ShareI } from "@/database/mongodb/dto/share.dto";

export class UserRepository {
	constructor(private database: ConnectionI) {}

	async getById(
		id: string,
		withPassword: boolean = false
	): Promise<UserReturnI | null> {
		try {
			const projection: any = {
				_id: 1,
				username: 1,
				email: 1,
				urlImage: "$url_image",
				bio: 1,
			};
			if (withPassword) {
				projection["salt"] = 1;
				projection["password"] = 1;
			}
			const userModel = this.database.get<UserI>("user");
			return await userModel
				.findById(id, projection)
				.lean()
				.then(async (user) => {
					const newUser = user as unknown as UserReturnI;
					if (newUser) {
						newUser.urlImage = await S3Service.getFileUrl(
							newUser.urlImage
						);
					}
					return newUser;
				});
		} catch {
			throw new DatabaseError({
				name: databaseError.RETRIEVE_ERROR,
				message: `get info user by id = ${id} error`,
				details: `get info user by id = ${id} error`,
				origin: this.getById.name,
			});
		}
	}

	async getByUsername(
		username: string,
		withPassword: boolean = false
	): Promise<UserReturnI | null> {
		try {
			const projection: any = {
				_id: 1,
				username: 1,
				email: 1,
				urlImage: "$url_image",
				bio: 1,
			};
			if (withPassword) {
				projection["salt"] = 1;
				projection["password"] = 1;
			}

			const userModel = this.database.get<UserI>("user");
			return await userModel
				.findOne(
					{
						username,
					},
					projection
				)
				.lean()
				.then(async (user) => {
					const newUser = user as unknown as UserReturnI;
					if (newUser) {
						newUser.urlImage = await S3Service.getFileUrl(
							newUser.urlImage
						);
					}
					return newUser;
				});
		} catch {
			throw new DatabaseError({
				name: databaseError.RETRIEVE_ERROR,
				message: `get info user by username = ${username} error`,
				details: `get info user by username = ${username} error`,
				origin: this.getByUsername.name,
			});
		}
	}

	async getByEmail(
		email: string,
		withPassword: boolean = false
	): Promise<UserReturnI | null> {
		try {
			const userModel = this.database.get<UserI>("user");
			const projection: any = {
				_id: 1,
				username: 1,
				email: 1,
				urlImage: "$url_image",
				bio: 1,
			};
			if (withPassword) {
				projection["salt"] = 1;
				projection["password"] = 1;
			}
			return await userModel
				.findOne(
					{
						email,
					},
					projection
				)
				.lean()
				.then(async (user) => {
					const newUser = user as unknown as UserReturnI;
					if (newUser) {
						newUser.urlImage = await S3Service.getFileUrl(
							newUser.urlImage
						);
					}
					return newUser;
				});
		} catch {
			throw new DatabaseError({
				name: databaseError.RETRIEVE_ERROR,
				message: `get info user by email = ${email} error`,
				details: `get info user by email = ${email} error`,
				origin: this.getByEmail.name,
			});
		}
	}

	async getBySearch({
		search,
		skip,
		withPassword = false,
		id,
	}: GetUserBySearchI): Promise<UserReturnI[]> {
		try {
			const userModel = this.database.get<UserI>("user");
			const projection: any = {
				_id: 1,
				username: 1,
				email: 1,
				urlImage: "$url_image",
				bio: 1,
			};
			if (withPassword) {
				projection["salt"] = 1;
				projection["password"] = 1;
			}
			return await userModel
				.find(
					{
						$or: [
							{
								username: {
									$regex: new RegExp(
										`.*(${search.toLowerCase()}).*`,
										"i"
									),
								},
							},
							{
								email: {
									$regex: new RegExp(
										`.*(${search.toLowerCase()}).*`,
										"i"
									),
								},
							},
						],
						_id: id
							? {
									$ne: new mongoose.Types.ObjectId(id),
							  }
							: {
									$ne: null,
							  },
					},
					projection,
					{
						skip: skip ? skip * LIMIT : 0,
						limit: LIMIT,
					}
				)
				.lean()
				.then(async (users) =>
					Promise.all(
						users.map(async (user) => {
							const newUser = user as unknown as UserReturnI;
							if (newUser) {
								newUser.urlImage = await S3Service.getFileUrl(
									newUser.urlImage
								);
							}
							return newUser;
						})
					)
				);
		} catch {
			throw new DatabaseError({
				name: databaseError.RETRIEVE_ERROR,
				message: `get info user by search = ${search} error`,
				details: `get info user by search = ${search} error`,
				origin: this.getByEmail.name,
			});
		}
	}

	async createUser({
		email,
		username,
		password,
		urlImage,
		bio,
	}: CreateUserI): Promise<void> {
		try {
			const userModel = this.database.get<UserI>("user");
			const salt = generateSalt();
			const hashedPassword = generatePassword(password, salt);
			await userModel.create({
				email,
				username,
				salt,
				password: hashedPassword,
				url_image: urlImage,
				bio,
			});
		} catch {
			throw new DatabaseError({
				name: databaseError.INSERT_ERROR,
				message: `can not create user (email, username, password, image_url, bio) values (${email}, ${username}, ${password}, ${urlImage}, ${bio})`,
				details: `can not create user (email, username, password, image_url, bio) values (${email}, ${username}, ${password}, ${urlImage}, ${bio})`,
				origin: this.createUser.name,
			});
		}
	}

	async getOtherUsers({ id, skip }: GetByIdI): Promise<UserReturnI[]> {
		try {
			const userModel = this.database.get<UserI>("user");
			return await userModel
				.find(
					{
						_id: {
							$ne: new mongoose.Types.ObjectId(id),
						},
					},
					{
						_id: 1,
						username: 1,
						email: 1,
						urlImage: "$url_image",
						bio: 1,
					},
					{
						skip: skip ? skip * LIMIT : 0,
						limit: LIMIT,
					}
				)
				.lean()
				.then(async (users) =>
					Promise.all(
						users.map(async (user) => {
							const newUser = user as unknown as UserReturnI;
							if (newUser) {
								newUser.urlImage = await S3Service.getFileUrl(
									newUser.urlImage
								);
							}
							return newUser;
						})
					)
				);
		} catch {
			throw new DatabaseError({
				name: databaseError.RETRIEVE_ERROR,
				message: `get all user with id different of ${id} error`,
				details: `get all user with id different of ${id} error`,
				origin: this.getOtherUsers.name,
			});
		}
	}

	async updateInfo({
		id,
		urlImage,
		bio,
		username,
	}: UpdateInfoI): Promise<void> {
		try {
			const userModel = this.database.get<UserI>("user");
			const objForUpdate: any = {};
			if (urlImage) {
				objForUpdate["url_image"] = urlImage;
			}
			if (bio) {
				objForUpdate["bio"] = bio;
			}
			if (username) {
				objForUpdate["username"] = username;
			}

			await userModel.findOneAndUpdate(
				{
					_id: new mongoose.Types.ObjectId(id),
				},
				{
					$set: objForUpdate,
				}
			);
		} catch {
			throw new DatabaseError({
				name: databaseError.UPDATE_ERROR,
				message: `can not update url of image: ${urlImage}, bio: ${bio}, username: ${username} for user id = ${id}`,
				details: `can not update url of image: ${urlImage}, bio: ${bio}, username: ${username} for user id = ${id}`,
				origin: this.updateInfo.name,
			});
		}
	}

	async postComment({
		idUser,
		idPost,
		content,
	}: PostCommentI): Promise<void> {
		try {
			const commentModel = this.database.get<CommentI>("comment");
			await commentModel.create({
				id_user: new mongoose.Types.ObjectId(idUser),
				id_post: new mongoose.Types.ObjectId(idPost),
				content,
				date: new Date(),
			});
		} catch {
			throw new DatabaseError({
				name: databaseError.INSERT_ERROR,
				message: `user ${idUser} cannot post comment to post ${idPost} with content = '${content}'`,
				details: `user ${idUser} cannot post comment to post ${idPost} with content = '${content}'`,
				origin: this.postComment.name,
			});
		}
	}

	async getIsLiked({ idUser, idPost }: LikePostI): Promise<boolean> {
		try {
			const likeModel = this.database.get<LikeI>("like");
			return !!(await likeModel.findOne({
				id_user: new mongoose.Types.ObjectId(idUser),
				id_post: new mongoose.Types.ObjectId(idPost),
			}));
		} catch {
			throw new DatabaseError({
				name: databaseError.RETRIEVE_ERROR,
				message: `cannot get is liked post ${idPost} of user ${idUser}`,
				details: `cannot get is liked post ${idPost} of user ${idUser}`,
				origin: this.getIsLiked.name,
			});
		}
	}

	async likePost({ idUser, idPost }: LikePostI): Promise<void> {
		try {
			const likeModel = this.database.get<LikeI>("like");
			const hasLiked: boolean = (await likeModel.findOne({
				id_user: new mongoose.Types.ObjectId(idUser),
				id_post: new mongoose.Types.ObjectId(idPost),
			}))
				? true
				: false;
			if (hasLiked) {
				await likeModel.deleteOne({
					id_user: new mongoose.Types.ObjectId(idUser),
					id_post: new mongoose.Types.ObjectId(idPost),
				});
			} else {
				await likeModel.create({
					id_user: new mongoose.Types.ObjectId(idUser),
					id_post: new mongoose.Types.ObjectId(idPost),
					date: new Date(),
				});
			}
		} catch {
			throw new DatabaseError({
				name: databaseError.UPDATE_ERROR,
				message: `user ${idUser} cannot like/dislike to post ${idPost}`,
				details: `user ${idUser} cannot like/dislike to post ${idPost}`,
				origin: this.postComment.name,
			});
		}
	}

	async getAllNotif({
		id,
		skip,
		isLiked = false,
	}: GetNotifByIdI): Promise<GetNotifReturnI[]> {
		try {
			const notifModel = this.database.get<NotificationI>("notification");
			return await notifModel
				.aggregate([
					{
						$match: {
							id_user: new mongoose.Types.ObjectId(id),
							type: isLiked
								? typeNotification.LIKE
								: {
										$ne: typeNotification.LIKE,
								  },
						},
					},
					{
						$lookup: {
							from: "users",
							localField: "id_sender",
							foreignField: "_id",
							as: "user",
						},
					},
					{
						$unwind: "$user",
					},
					{
						$sort: { date: -1 },
					},
					{
						$skip: skip ? skip * LIMIT : 0,
					},
					{
						$limit: LIMIT,
					},
					{
						$project: {
							_id: 1,
							idUser: "$id_user",
							idSender: "$id_sender",
							idPost: "$id_post",
							isViewed: "$is_viewed",
							isClicked: "$is_clicked",
							type: 1,
							title: 1,
							date: 1,
							user: {
								_id: "$user._id",
								username: "$user.username",
								email: "$user.email",
								urlImage: "$user.url_image",
								bio: "$user.bio",
							},
						},
					},
				])
				.then(async (notifs) =>
					Promise.all(
						notifs.map(async (notif) => {
							const newNotif =
								notif as unknown as GetNotifReturnI;
							if (newNotif) {
								newNotif.user.urlImage =
									await S3Service.getFileUrl(
										newNotif.user.urlImage
									);
							}
							return newNotif;
						})
					)
				);
		} catch {
			throw new DatabaseError({
				name: databaseError.RETRIEVE_ERROR,
				message: `cannot get notification of user ${id}`,
				details: `cannot get notification of user ${id}`,
				origin: this.getAllNotif.name,
			});
		}
	}

	async getNumberNotif(
		id: string,
		isLiked: boolean = false
	): Promise<number> {
		try {
			const notifModel = this.database.get<NotificationI>("notification");
			return await notifModel
				.aggregate([
					{
						$match: {
							id_user: new mongoose.Types.ObjectId(id),
							is_viewed: false,
							type: isLiked
								? typeNotification.LIKE
								: {
										$ne: typeNotification.LIKE,
								  },
						},
					},
					{
						$count: "count",
					},
				])
				.then((value) => value.at(0)?.count as number);
		} catch {
			throw new DatabaseError({
				name: databaseError.RETRIEVE_ERROR,
				message: `cannot get number notif of user ${id}`,
				details: `cannot get number notif of user ${id}`,
				origin: this.getNumberNotif.name,
			});
		}
	}

	async getNumberPost(id: string): Promise<number> {
		try {
			const postModel = this.database.get<PostI>("post");
			return await postModel
				.aggregate([
					{
						$match: {
							id_user: new mongoose.Types.ObjectId(id),
						},
					},
					{
						$count: "count",
					},
				])
				.then((value) => value.at(0).count as number);
		} catch (err) {
			throw new DatabaseError({
				name: databaseError.RETRIEVE_ERROR,
				message: `cannot get number post of user ${id}`,
				details: `cannot get number post of user ${id}`,
				origin: this.getNumberPost.name,
			});
		}
	}

	async sharePost(posts: SharePostI[]): Promise<void> {
		try {
			const shareModel = this.database.get<ShareI>("share");
			await shareModel.insertMany(
				posts.map((post) => ({
					id_user: post.id,
					id_receiver: post.idReceiver,
					id_post: post.idPost,
					date: new Date(),
				}))
			);
		} catch (err) {
			throw new DatabaseError({
				name: databaseError.RETRIEVE_ERROR,
				message: `cannot share posts `,
				details: `cannot share posts`,
				origin: this.getNumberPost.name,
			});
		}
	}
}
