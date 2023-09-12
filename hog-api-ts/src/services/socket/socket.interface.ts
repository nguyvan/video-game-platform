import { typeNotification } from "@/database/constant/config.mongo";
import { UserReturnI } from "@/repository/interfaces/user.interface";
import { Server, Socket } from "socket.io";

export interface ExtendSocket extends Socket {
	tokenPayload?: any;
}

export interface sendNotifI {
	user: UserReturnI;
	date: Date;
	type: typeNotification;
	title: string;
	receivers: string[];
}

export interface SocketServiceI {
	init: () => Promise<void>;
	addUser: (socket: ExtendSocket) => Promise<void>;
	disconnect: (socket: ExtendSocket) => Promise<void>;
	sendNotif: (options: sendNotifI) => Promise<void>;
}
