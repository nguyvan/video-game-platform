import mongoose, { Document } from "mongoose";

export interface PostI extends Document {
	_id: mongoose.Types.ObjectId;
	url_video?: string;
	url_image?: string;
	id_user: mongoose.Types.ObjectId;
	title: string;
	date: Date;
}
