import { io, Socket } from "socket.io-client";
import { appConfig } from "../config/app.config";
import { Auth } from "../lib/auth";
import { typeToken } from "../types/token";
import { errorMessage } from "../types/error";
import { refreshToken } from "../api/auth/refreshToken";
import { eventSocket } from "../types/event";

export class SocketClient {
    private static instance: SocketClient;
    public socket?: Socket = undefined;
    constructor() {
        if (!SocketClient.instance) {
            this.initializeSocket();
            SocketClient.instance = this;
        }
        return SocketClient.instance;
    }

    initializeSocket() {
        this.socket = io(appConfig.BASE_URL.replace("/api", ""), {
            autoConnect: false,
            withCredentials: true,
            auth: { token: Auth.get(typeToken.ACCESS_TOKEN) },
        }).on("connect_error", this.handleError.bind(this));
        return this.socket;
    }

    async handleError(error: Error) {
        if (error.message === errorMessage.INVALID_CREDENTIALS) {
            const existingToken = Auth.get();
            if (!existingToken) {
                return;
            } else {
                refreshToken().then(() => {
                    this.socket!.auth = {
                        token: existingToken,
                    };
                    this.socket!.connect();
                });
            }
        }
    }

    connect() {
        this.socket!.connect();
    }

    disconnect() {
        this.socket!.disconnect();
    }

    receiveNotif(callback: (args: any) => void) {
        this.socket!.on(eventSocket.SEND_NOTIF, callback);
    }

    postComment(args: any) {
        this.socket!.emit(eventSocket.POST_COMMENT, args);
    }

    receiveComment(callback: (args: any) => void) {
        this.socket!.on(eventSocket.RECEIVE_COMMENT, callback);
    }
}
