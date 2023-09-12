import { DatabaseError } from "@/errors/database.error";
import { databaseName } from "./constant/name-database";
import { ConnectionI } from "./interface/connection.interface";
import { MongoDBConnection } from "./mongodb/connection.mongo";
import { databaseError } from "@/constants/error.constant";

export class StorageFactory {
	private static database: Map<databaseName, ConnectionI> = new Map<
		databaseName,
		ConnectionI
	>();

	static async getDatabase(
		dbname: databaseName
	): Promise<ConnectionI | undefined> {
		return this.database.get(dbname);
	}

	static async setDatabase(dbname: databaseName): Promise<void> {
		switch (dbname) {
			case "mongo":
				const mongoDBConnection = new MongoDBConnection();
				await mongoDBConnection.init();
				this.database.set(dbname, mongoDBConnection);
				break;
			default:
				throw new DatabaseError({
					name: databaseError.DATABASE_NOT_FOUND,
					message: `database ${dbname} is not existed`,
					details: `database ${dbname} is not existed`,
					origin: this.setDatabase.name,
				});
		}
	}
}
