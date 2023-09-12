import { DATABASE_CONFIG } from "@/config/database.config";
import { RedisClientType, createClient } from "redis";
import { ExtendSocket } from "@/services/socket/socket.interface";
import { databaseError } from "@/constants/error.constant";
import { DatabaseError } from "@/errors/database.error";
import { CacheServiceI } from "@/services/cache/cache.interface";

export class CacheService implements CacheServiceI {
	private cache: RedisClientType;
	constructor(url: string = DATABASE_CONFIG.URI_REDIS_CONNECTION) {
		this.cache = createClient({
			url,
		});
	}

	async connect() {
		try {
			await this.cache.connect();
		} catch {
			throw new DatabaseError({
				name: databaseError.CONNECTION_ERROR,
				message: "cannot connect to redis database",
				details: "cannot connect to redis database",
				origin: this.connect.name,
			});
		}
	}

	async addUser(socket: ExtendSocket) {
		try {
			await this.cache.sAdd(socket.tokenPayload?.id, socket.id);
		} catch {
			throw new DatabaseError({
				name: databaseError.INSERT_ERROR,
				message: `cannot add value socket ${socket.id} of user ${socket.tokenPayload?.id}`,
				details: `cannot add value socket ${socket.id} of user ${socket.tokenPayload?.id}`,
				origin: this.addUser.name,
			});
		}
	}

	async getUsers(socket: ExtendSocket): Promise<string[]> {
		try {
			return await this.cache.sMembers(socket.tokenPayload?.id);
		} catch {
			throw new DatabaseError({
				name: databaseError.RETRIEVE_ERROR,
				message: `cannot get sockets of user ${socket.tokenPayload?.id}`,
				details: `cannot get sockets of user ${socket.tokenPayload?.id}`,
				origin: this.addUser.name,
			});
		}
	}

	async removeUser(socket: ExtendSocket): Promise<void> {
		try {
			await this.cache.sRem(socket.tokenPayload?.id, socket.id);
		} catch {
			throw new DatabaseError({
				name: databaseError.DELETE_ERROR,
				message: `cannot remove value socket ${socket.id} of user ${socket.tokenPayload?.id}`,
				details: `cannot remove value socket ${socket.id} of user ${socket.tokenPayload?.id}`,
				origin: this.addUser.name,
			});
		}
	}

	async getRoomUsers(ids: string[]): Promise<string[]> {
		try {
			const listRooms = await Promise.all(
				ids.map(async (id) => {
					return await this.cache.sMembers(id);
				})
			);
			return listRooms.reduce((prev, curr) => [...prev, ...curr], []);
		} catch {
			throw new DatabaseError({
				name: databaseError.RETRIEVE_ERROR,
				message: `cannot get room of users ${ids}`,
				details: `cannot get room of users ${ids}`,
				origin: this.addUser.name,
			});
		}
	}
}
