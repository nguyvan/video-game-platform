import mongoose, { Document } from "mongoose";

export interface ShareI extends Document {
	_id: mongoose.Types.ObjectId;
	id_user: string;
	id_receiver: string;
	id_post: mongoose.Types.ObjectId;
	date: Date;
}
