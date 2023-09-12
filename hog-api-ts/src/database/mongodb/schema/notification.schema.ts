import { typeNotification } from "@/database/constant/config.mongo";
import { NotificationI } from "@/database/mongodb/dto/notification.dto";
import { Schema } from "mongoose";

const NotificationSchema = new Schema<NotificationI>({
	id_user: Schema.ObjectId,
	id_sender: Schema.ObjectId,
	id_post: Schema.ObjectId,
	is_viewed: Boolean,
	is_clicked: Boolean,
	type: {
		type: String,
		enum: typeNotification,
	},
	title: String,
	date: Date,
});

export { NotificationSchema };
