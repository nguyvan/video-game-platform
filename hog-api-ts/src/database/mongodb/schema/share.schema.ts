import { ShareI } from "@/database/mongodb/dto/share.dto";
import { Schema } from "mongoose";

const ShareSchema = new Schema<ShareI>({
	id_user: Schema.ObjectId,
	id_receiver: Schema.ObjectId,
	id_post: Schema.ObjectId,
	date: Date,
});

export { ShareSchema };
