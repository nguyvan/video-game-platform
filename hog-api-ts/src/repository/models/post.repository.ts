import { ConnectionI } from "@/database/interface/connection.interface";
import {
	GetPostByIdI,
	GetPostI,
	PostCreateI,
	ReturnCommentI,
	ReturnPostI,
} from "../interfaces/post.interface";
import { DatabaseError } from "@/errors/database.error";
import { databaseError } from "@/constants/error.constant";
import { PostI } from "@/database/mongodb/dto/post.dto";
import { LIMIT } from "@/constants/pagination.constant";
import mongoose from "mongoose";
import { CommentI } from "@/database/mongodb/dto/comment.dto";
import { S3Service } from "@/services/s3";

export class PostRepository {
	constructor(private database: ConnectionI) {}

	async create({
		idUser,
		title,
		urlImage,
		urlVideo,
	}: PostCreateI): Promise<void> {
		try {
			const postModel = this.database.get<PostI>("post");
			await postModel.create({
				id_user: idUser,
				title,
				url_image: urlImage,
				url_video: urlVideo,
				date: new Date(),
			});
		} catch {
			throw new DatabaseError({
				name: databaseError.INSERT_ERROR,
				message: `cannot insert data (idUser, title, urlImage, urlVideo) values (${idUser}, ${title}, ${urlImage}, ${urlVideo}) into Post`,
				details: `cannot insert data (idUser, title, urlImage, urlVideo) values (${idUser}, ${title}, ${urlImage}, ${urlVideo}) into Post`,
				origin: this.create.name,
			});
		}
	}

	async get({
		idUser = undefined,
		skip,
		idOwnUser,
	}: GetPostI): Promise<ReturnPostI[]> {
		try {
			const postModel = this.database.get<PostI>("post");
			return await postModel
				.aggregate([
					{
						$lookup: {
							from: "users",
							localField: "id_user",
							foreignField: "_id",
							as: "user",
						},
					},
					{
						$match: {
							id_user: idUser
								? new mongoose.Types.ObjectId(idUser)
								: {
										$ne: null,
								  },
						},
					},
					{
						$unwind: "$user",
					},
					{
						$lookup: {
							from: "comments",
							localField: "_id",
							foreignField: "id_post",
							as: "comment",
						},
					},
					{
						$lookup: {
							from: "likes",
							localField: "_id",
							foreignField: "id_post",
							as: "like",
						},
					},
					{
						$lookup: {
							from: "shares",
							localField: "_id",
							foreignField: "id_post",
							as: "share",
						},
					},
					{
						$addFields: {
							isLiked: idOwnUser
								? {
										$size: {
											$filter: {
												input: "$like",
												as: "item",
												cond: {
													$eq: [
														"$$item.id_user",
														new mongoose.Types.ObjectId(
															idOwnUser
														),
													],
												},
											},
										},
								  }
								: false,
							nbComments: {
								$cond: {
									if: { $isArray: "$comment" },
									then: { $size: "$comment" },
									else: 0,
								},
							},
							nbLikes: {
								$cond: {
									if: { $isArray: "$like" },
									then: { $size: "$like" },
									else: 0,
								},
							},
							nbShares: {
								$cond: {
									if: { $isArray: "$share" },
									then: { $size: "$share" },
									else: 0,
								},
							},
						},
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
							urlVideo: "$url_video",
							urlImage: "$url_image",
							idUser: "$id_user",
							title: 1,
							date: 1,
							user: {
								_id: "$user._id",
								username: "$user.username",
								email: "$user.email",
								urlImage: "$user.url_image",
								bio: "$user.bio",
							},
							isLiked: 1,
							nbComments: 1,
							nbLikes: 1,
							nbShares: 1,
						},
					},
				])
				.then((posts) =>
					Promise.all(
						posts.map(async (post) => {
							post.user.urlImage = await S3Service.getFileUrl(
								post.user.urlImage
							);
							post.urlImage = await S3Service.getFileUrl(
								post.urlImage
							);
							post.urlVideo = await S3Service.getFileUrl(
								post.urlVideo
							);
							return post;
						})
					)
				);
		} catch {
			throw new DatabaseError({
				name: databaseError.RETRIEVE_ERROR,
				message: `cannot get all post`,
				details: `cannot get all post`,
				origin: this.get.name,
			});
		}
	}

	async getById({
		idUser = undefined,
		skip,
		id,
		idOwnUser,
	}: GetPostByIdI): Promise<ReturnPostI> {
		try {
			const postModel = this.database.get<PostI>("post");
			if (id) {
				return await postModel
					.aggregate([
						{
							$match: {
								_id: new mongoose.Types.ObjectId(id),
							},
						},
						{
							$lookup: {
								from: "users",
								localField: "id_user",
								foreignField: "_id",
								as: "user",
							},
						},
						{
							$unwind: "$user",
						},
						{
							$lookup: {
								from: "comments",
								localField: "_id",
								foreignField: "id_post",
								as: "comment",
							},
						},
						{
							$lookup: {
								from: "likes",
								localField: "_id",
								foreignField: "id_post",
								as: "like",
							},
						},
						{
							$lookup: {
								from: "shares",
								localField: "_id",
								foreignField: "id_post",
								as: "share",
							},
						},
						{
							$addFields: {
								isLiked: idOwnUser
									? {
											$size: {
												$filter: {
													input: "$like",
													as: "item",
													cond: {
														$eq: [
															"$$item.id_user",
															new mongoose.Types.ObjectId(
																idOwnUser
															),
														],
													},
												},
											},
									  }
									: false,
								nbComments: {
									$cond: {
										if: { $isArray: "$comment" },
										then: { $size: "$comment" },
										else: 0,
									},
								},
								nbLikes: {
									$cond: {
										if: { $isArray: "$like" },
										then: { $size: "$like" },
										else: 0,
									},
								},
								nbShares: {
									$cond: {
										if: { $isArray: "$share" },
										then: { $size: "$share" },
										else: 0,
									},
								},
							},
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
								urlVideo: "$url_video",
								urlImage: "$url_image",
								idUser: "$id_user",
								title: 1,
								date: 1,
								user: {
									_id: "$user._id",
									username: "$user.username",
									email: "$user.email",
									urlImage: "$user.url_image",
									bio: "$user.bio",
								},
								isLiked: 1,
								nbComments: 1,
								nbLikes: 1,
								nbShares: 1,
							},
						},
					])
					.then(async (posts) => {
						const post = posts.at(0) as ReturnPostI;
						if (post) {
							post.user.urlImage = await S3Service.getFileUrl(
								post.user.urlImage
							);
							post.urlImage = (await S3Service.getFileUrl(
								post.urlImage
							)) as string;
							post.urlVideo = (await S3Service.getFileUrl(
								post.urlVideo
							)) as string;
						}
						return post;
					});
			} else {
				return await postModel
					.aggregate([
						{
							$sample: {
								size: 1,
							},
						},
						{
							$lookup: {
								from: "users",
								localField: "id_user",
								foreignField: "_id",
								as: "user",
							},
						},
						{
							$unwind: "$user",
						},
						{
							$lookup: {
								from: "comments",
								localField: "_id",
								foreignField: "id_post",
								as: "comment",
							},
						},
						{
							$lookup: {
								from: "likes",
								localField: "_id",
								foreignField: "id_post",
								as: "like",
							},
						},
						{
							$lookup: {
								from: "shares",
								localField: "_id",
								foreignField: "id_post",
								as: "share",
							},
						},
						{
							$addFields: {
								isLiked: idUser
									? {
											$size: {
												$filter: {
													input: "$like",
													as: "item",
													cond: {
														$eq: [
															"$$item.id_user",
															new mongoose.Types.ObjectId(
																idUser
															),
														],
													},
												},
											},
									  }
									: false,
								nbComments: {
									$cond: {
										if: { $isArray: "$comment" },
										then: { $size: "$comment" },
										else: 0,
									},
								},
								nbLikes: {
									$cond: {
										if: { $isArray: "$like" },
										then: { $size: "$like" },
										else: 0,
									},
								},
								nbShares: {
									$cond: {
										if: { $isArray: "$share" },
										then: { $size: "$share" },
										else: 0,
									},
								},
							},
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
								urlVideo: "$url_video",
								urlImage: "$url_image",
								idUser: "$id_user",
								title: 1,
								date: 1,
								user: {
									_id: "$user._id",
									username: "$user.username",
									email: "$user.email",
									urlImage: "$user.url_image",
									bio: "$user.bio",
								},
								isLiked: 1,
								nbComments: 1,
								nbLikes: 1,
								nbShares: 1,
							},
						},
					])
					.then(async (posts) => {
						const post = posts.at(0) as ReturnPostI;
						if (post) {
							post.user.urlImage = await S3Service.getFileUrl(
								post.user.urlImage
							);
							post.urlImage = (await S3Service.getFileUrl(
								post.urlImage
							)) as string;
							post.urlVideo = (await S3Service.getFileUrl(
								post.urlVideo
							)) as string;
						}
						return post;
					});
			}
		} catch {
			throw new DatabaseError({
				name: databaseError.RETRIEVE_ERROR,
				message: `cannot get post ${id}`,
				details: `cannot get post ${id}`,
				origin: this.getById.name,
			});
		}
	}

	async getComment(id: string, skip: number = 0): Promise<ReturnCommentI[]> {
		try {
			const commentModel = this.database.get<CommentI>("comment");
			return await commentModel
				.aggregate([
					{
						$match: {
							id_post: new mongoose.Types.ObjectId(id),
						},
					},
					{
						$lookup: {
							from: "users",
							localField: "id_user",
							foreignField: "_id",
							as: "user",
						},
					},
					{
						$unwind: "$user",
					},
					{
						$sort: { date: 1 },
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
							idPost: "$id_post",
							content: 1,
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
				.then((comments) =>
					Promise.all(
						comments.map(async (comment) => {
							comment.user.urlImage = await S3Service.getFileUrl(
								comment.user.urlImage
							);
							return comment;
						})
					)
				);
		} catch {
			throw new DatabaseError({
				name: databaseError.RETRIEVE_ERROR,
				message: `cannot get comment of post ${id}`,
				details: `cannot get comment of post ${id}`,
				origin: this.getById.name,
			});
		}
	}
}
