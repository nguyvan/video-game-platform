import { CommentI } from "@/database/mongodb/dto/comment.dto";
import { Schema } from "mongoose";

const CommentSchema = new Schema<CommentI>({
	id_user: Schema.ObjectId,
	id_post: Schema.ObjectId,
	content: String,
	date: Date,
});

export { CommentSchema };
