import { UserI } from "@/database/mongodb/dto/user.dto";
import { PostI } from "@/database/mongodb/dto/post.dto";
import { CommentI } from "@/database/mongodb/dto/comment.dto";
import { NotificationI } from "@/database/mongodb/dto/notification.dto";
import { ShareI } from "@/database/mongodb/dto/share.dto";
import { Model } from "mongoose";

export type ModelDTO = UserI | PostI | CommentI | NotificationI | ShareI;

export type ModelI =
	| Model<UserI>
	| Model<PostI>
	| Model<CommentI>
	| Model<NotificationI>
	| Model<ShareI>;

export type modelName =
	| "user"
	| "comment"
	| "auth_token"
	| "notification"
	| "post"
	| "share";

export enum typeNotification {
	LIKE = "LIKE",
	COMMENT = "COMMENT",
	SHARE = "SHARE",
	GET_SHARE = "GET_SHARE",
	REPLY = "REPLY",
}
