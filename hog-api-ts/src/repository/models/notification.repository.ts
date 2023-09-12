import { appError, databaseError } from "@/constants/error.constant";
import { typeNotification } from "@/database/constant/config.mongo";
import { ConnectionI } from "@/database/interface/connection.interface";
import { NotificationI } from "@/database/mongodb/dto/notification.dto";
import { DatabaseError } from "@/errors/database.error";
import mongoose from "mongoose";
import {
	GetNumberPeopleI,
	UpsertNotifI,
} from "../interfaces/notification.interface";
import { AppError } from "@/errors/app.error";
import { StatusCodes } from "http-status-codes";
import { CommentI } from "@/database/mongodb/dto/comment.dto";
import { LikeI } from "@/database/mongodb/dto/like.dto";
import { ShareI } from "@/database/mongodb/dto/share.dto";

export class NotificationRepository {
	constructor(private database: ConnectionI) {}

	async updateView(id: string, isLiked: boolean = false): Promise<void> {
		try {
			const notificationModel =
				this.database.get<NotificationI>("notification");
			await notificationModel.updateMany(
				{
					id_user: new mongoose.Types.ObjectId(id),
					type: isLiked
						? typeNotification.LIKE
						: {
								$ne: typeNotification.LIKE,
						  },
				},
				{
					is_viewed: true,
				}
			);
		} catch {
			throw new DatabaseError({
				name: databaseError.UPDATE_ERROR,
				message: `cannot update viewed notification of user ${id}`,
				details: `cannot update viewed notification of user ${id}`,
				origin: this.updateView.name,
			});
		}
	}

	async updateClick(id: string, isLiked: boolean = false): Promise<void> {
		try {
			const notificationModel =
				this.database.get<NotificationI>("notification");
			await notificationModel.updateOne(
				{
					_id: new mongoose.Types.ObjectId(id),
					type: isLiked
						? typeNotification.LIKE
						: {
								$ne: typeNotification.LIKE,
						  },
				},
				{
					is_clicked: true,
				}
			);
		} catch {
			throw new DatabaseError({
				name: databaseError.UPDATE_ERROR,
				message: `cannot update clicked of notification ${id}`,
				details: `cannot update clicked of notification ${id}`,
				origin: this.updateClick.name,
			});
		}
	}

	async upsertNotif({
		idUser,
		idSender,
		idPost,
		type,
		title,
	}: UpsertNotifI): Promise<void> {
		try {
			const notificationModel =
				this.database.get<NotificationI>("notification");
			const notif = await notificationModel.findOne({
				id_user: idUser,
				id_post: idPost,
				type,
			});
			if (!!notif) {
				await notificationModel.findOneAndUpdate(
					{
						id_user: idUser,
						id_post: idPost,
						type,
					},
					{
						$set: {
							id_user: idUser,
							id_sender: idSender,
							id_post: idPost,
							type,
							title,
							date: new Date(),
							is_clicked: false,
							is_viewed: false,
						},
					}
				);
			} else {
				await notificationModel.create({
					id_user: idUser,
					id_sender: idSender,
					id_post: idPost,
					type,
					title,
					date: new Date(),
					is_clicked: false,
					is_viewed: false,
				});
			}
		} catch {
			throw new DatabaseError({
				name: databaseError.UPDATE_ERROR,
				message: `cannot update update or insert notification`,
				details: `cannot update update or insert notification`,
				origin: this.upsertNotif.name,
			});
		}
	}

	async getNumberPeople({
		idUser,
		idPost,
		type,
	}: GetNumberPeopleI): Promise<number> {
		try {
			const aggregateOption = [
				{
					$match: {
						id_post: new mongoose.Types.ObjectId(idPost),
						id_user: {
							$ne: new mongoose.Types.ObjectId(idUser),
						},
					},
				},
				{
					$group: {
						_id: {
							id_post: "$id_post",
							id_user: "$id_user",
						},
						number: {
							$sum: 1,
						},
					},
				},
				{
					$count: "nbPeople",
				},
			];

			switch (type) {
				case typeNotification.COMMENT:
					const commentModel = this.database.get<CommentI>("comment");
					return await commentModel
						.aggregate(aggregateOption)
						.then((value) =>
							value.length ? (value.at(0).nbPeople as number) : 0
						);
				case typeNotification.LIKE:
					const likeModel = this.database.get<LikeI>("like");
					return await likeModel
						.aggregate(aggregateOption)
						.then((value) =>
							value.length ? (value.at(0).nbPeople as number) : 0
						);
				case typeNotification.GET_SHARE:
					const shareModel = this.database.get<ShareI>("share");
					return await shareModel
						.aggregate(aggregateOption)
						.then((value) =>
							value.length ? (value.at(0).nbPeople as number) : 0
						);
				default:
					throw new AppError({
						name: appError.NOT_FOUND,
						message: `cannot find type notification`,
						details: `cannot find type notification`,
						statusCode: StatusCodes.NOT_FOUND,
						origin: this.getNumberPeople.name,
					});
			}
		} catch {
			throw new DatabaseError({
				name: databaseError.RETRIEVE_ERROR,
				message: `cannot get number of people of ${type}`,
				details: `cannot get number of people of ${type}`,
				origin: this.getNumberPeople.name,
			});
		}
	}
}
