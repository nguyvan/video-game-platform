import { LikeI } from "@/database/mongodb/dto/like.dto";
import { Schema } from "mongoose";

const LikeSchema = new Schema<LikeI>({
	id_user: Schema.ObjectId,
	id_post: Schema.ObjectId,
	date: Date,
});

export { LikeSchema };
