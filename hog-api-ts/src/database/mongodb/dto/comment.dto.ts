import mongoose, { Document } from "mongoose";

export interface CommentI extends Document {
	_id: mongoose.Types.ObjectId;
	id_user: mongoose.Types.ObjectId;
	id_post: mongoose.Types.ObjectId;
	content: string;
	date: Date;
}
