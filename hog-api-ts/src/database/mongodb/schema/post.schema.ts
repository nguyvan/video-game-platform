import { PostI } from "@/database/mongodb/dto/post.dto";
import { Schema } from "mongoose";

const PostSchema = new Schema<PostI>({
	url_video: String,
	url_image: String,
	id_user: Schema.ObjectId,
	title: String,
	date: Date,
});

export { PostSchema };
