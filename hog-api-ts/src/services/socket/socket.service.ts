import { INJECTION_TYPE } from "@/constants/injection.constant";
import { injectable, inject } from "inversify";
import { Server } from "socket.io";
import http from "http";
import { DatabaseError } from "@/errors/database.error";
import { appError } from "@/constants/error.constant";
import { validateToken } from "@/utils/token.util";
import { AppError } from "@/errors/app.error";
import { StatusCodes } from "http-status-codes";
import {
	ExtendSocket,
	SocketServiceI,
	sendNotifI,
} from "@/services/socket/socket.interface";
import { CacheServiceI } from "@/services/cache/cache.interface";
import { CacheService } from "@/services/cache/cache.service";
import { eventSocket } from "@/constants/event-socket.constant";

@injectable()
export class SocketService implements SocketServiceI {
	private io_: Server;
	private cache: CacheServiceI;

	constructor(@inject(INJECTION_TYPE.SERVER) httpServer: http.Server) {
		this.io_ = new Server(httpServer, {
			cors: {
				origin: "*",
				methods: ["GET", "POST"],
				credentials: true,
			},
			allowEIO3: true,
			transports: ["websocket", "polling"],
		});
		this.cache = new CacheService();
	}

	async init() {
		try {
			await this.cache.connect();
			this.io_
				.use(async (socket: ExtendSocket, next) => {
					const token = socket.handshake?.auth?.token;
					try {
						if (token) {
							const decoded = validateToken(token);
							socket.tokenPayload = decoded;
							next();
						} else {
							next(
								new AppError({
									name: appError.SOCKET_ERROR,
									message: `invalid token`,
									details: `invalid token`,
									statusCode: StatusCodes.UNAUTHORIZED,
									origin: this.init.name,
								})
							);
						}
					} catch {
						next(
							new AppError({
								name: appError.SOCKET_ERROR,
								message: `invalid token`,
								details: `invalid token`,
								statusCode: StatusCodes.UNAUTHORIZED,
								origin: this.init.name,
							})
						);
					}
				})
				.on("connection", async (socket: ExtendSocket) => {
					await this.addUser(socket);

					socket.on(eventSocket.POST_COMMENT, (args) => {
						this.io_.emit(eventSocket.RECEIVE_COMMENT, args);
					});

					socket.on("disconnect", async () => {
						await this.disconnect(socket);
					});
				});
		} catch (err) {
			if (err instanceof DatabaseError || err instanceof AppError) {
				throw err;
			} else {
				throw new AppError({
					name: appError.SOCKET_ERROR,
					message: "cannot initialize socket",
					details: "cannot initialize socket",
					statusCode: StatusCodes.BAD_GATEWAY,
					origin: this.init.name,
				});
			}
		}
	}

	async addUser(socket: ExtendSocket): Promise<void> {
		await this.cache.addUser(socket);
	}

	async disconnect(socket: ExtendSocket): Promise<void> {
		await this.cache.removeUser(socket);
	}

	async sendNotif({
		user,
		title,
		date,
		type,
		receivers,
	}: sendNotifI): Promise<void> {
		const rooms = await this.cache.getRoomUsers(receivers);
		if (rooms.length) {
			this.io_
				.to(rooms)
				.emit(eventSocket.SEND_NOTIF, { user, title, date, type });
		}
	}
}
