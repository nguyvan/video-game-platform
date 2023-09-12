import { UserReturnI } from "../api/new-feed/getUser";

export enum eventSocket {
    SEND_NOTIF = "SEND_NOTIF",
    GET_NOTIF = "GET_NOTIF",
    POST_COMMENT = "POST_COMMENT",
    RECEIVE_COMMENT = "RECEIVE_COMMENT",
}

export enum typeNotification {
    LIKE = "LIKE",
    COMMENT = "COMMENT",
    SHARE = "SHARE",
    GET_SHARE = "GET_SHARE",
    REPLY = "REPLY",
}

export interface SendNotifI {
    user?: UserReturnI;
    date?: string;
    type?: typeNotification;
    title?: string;
}
