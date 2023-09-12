import mongoose, { Document } from "mongoose";

export interface UserI extends Document {
	_id: mongoose.Types.ObjectId;
	username: string;
	email: string;
	salt?: string;
	password?: string;
	url_image?: string;
	bio?: string;
}
