import { databaseError } from "@/constants/error.constant";
import { ConnectionI } from "@/database/interface/connection.interface";
import { DatabaseError } from "@/errors/database.error";
import mongoose, { Connection, Model } from "mongoose";
import { ModelI, modelName } from "@/database/constant/config.mongo";
import { databaseName } from "../constant/name-database";
import { DATABASE_CONFIG } from "@/config/database.config";
import path from "path";
import { SchemasI, getSchemasMongo } from "@/utils/schema-mongo.util";
import { CommentSchema } from "./schema/comment.schema";
import { LikeSchema } from "./schema/like.schema";
import { NotificationSchema } from "./schema/notification.schema";
import { PostSchema } from "./schema/post.schema";
import { ShareSchema } from "./schema/share.schema";
import { UserSchema } from "./schema/user.schema";

export class MongoDBConnection implements ConnectionI {
	private conn: Connection;
	private modelManager: Map<modelName, ModelI>;

	constructor() {
		this.conn = this.connect(DATABASE_CONFIG.URI_MONGODB_CONNECTION);
		this.modelManager = new Map<modelName, ModelI>();
	}

	connect(uri: string): Connection {
		try {
			return mongoose.createConnection(uri);
		} catch {
			throw new DatabaseError({
				name: databaseError.CONNECTION_ERROR,
				details: "invalid uri",
				origin: this.connect.name,
				message: "MongoDB connection error",
			});
		}
	}

	async init() {
		try {
			// TODO: change these line

			// const schemaDir: string = "./schema";
			// const schemas: SchemasI[] = await getSchemasMongo(
			// 	path.resolve(__dirname, schemaDir)
			// );
			const schemas: SchemasI[] = [
				{
					name: "comment",
					schema: CommentSchema,
				},
				{
					name: "like",
					schema: LikeSchema,
				},
				{
					name: "notification",
					schema: NotificationSchema,
				},
				{
					name: "post",
					schema: PostSchema,
				},
				{
					name: "share",
					schema: ShareSchema,
				},
				{
					name: "user",
					schema: UserSchema,
				},
			];
			for (const schema of schemas) {
				const model = this.conn.model(schema.name, schema.schema);
				this.modelManager.set(
					schema.name as modelName,
					model as unknown as ModelI
				);
			}
		} catch {
			throw new DatabaseError({
				name: databaseError.INIT_DATABASE_ERROR,
				message: "init database error",
				details: "unknow error",
				origin: this.init.name,
			});
		}
	}

	get<T>(model: string): Model<T> {
		if (!this.modelManager.has(model as modelName)) {
			throw new DatabaseError({
				name: databaseError.MODEL_NOT_FOUND,
				message: `model ${model} is not found`,
				details: `model ${model} is not found`,
				origin: this.get.name,
			});
		}
		return this.modelManager.get(
			model as modelName
		)! as unknown as Model<T>;
	}

	disconnect(): void {
		try {
			this.conn.close();
		} catch {
			throw new DatabaseError({
				name: databaseError.DISCONNECTION_ERROR,
				details: "unknown error",
				origin: this.disconnect.name,
				message: "MongoDB disconnection error",
			});
		}
	}

	getModalName(): databaseName {
		return "mongo";
	}
}
