import { typeNotification } from "@/database/constant/config.mongo";
import mongoose, { Document } from "mongoose";

export interface NotificationI extends Document {
	_id: mongoose.Types.ObjectId;
	id_user: mongoose.Types.ObjectId;
	id_sender: mongoose.Types.ObjectId;
	id_post: mongoose.Types.ObjectId;
	is_viewed: boolean;
	is_clicked: boolean;
	type: typeNotification;
	title: String;
	date: Date;
}
