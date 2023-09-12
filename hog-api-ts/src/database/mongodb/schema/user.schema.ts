import { UserI } from "@/database/mongodb/dto/user.dto";
import { Schema } from "mongoose";

const UserSchema = new Schema<UserI>({
	username: {
		type: String,
		required: true,
		unique: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	salt: {
		type: String,
		required: false,
	},
	password: {
		type: String,
		required: false,
	},
	url_image: String,
	bio: String,
});

export { UserSchema };
