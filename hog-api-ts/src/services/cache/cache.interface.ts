import { ExtendSocket } from "@/services/socket/socket.interface";

export interface CacheServiceI {
	connect: () => Promise<void>;
	addUser: (socket: ExtendSocket) => Promise<void>;
	getUsers: (socket: ExtendSocket) => Promise<string[]>;
	removeUser: (socket: ExtendSocket) => Promise<void>;
	getRoomUsers: (ids: string[]) => Promise<string[]>;
}
