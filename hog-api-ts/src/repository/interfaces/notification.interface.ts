import { typeNotification } from "@/database/constant/config.mongo";

export interface UpsertNotifI {
	idUser: string;
	idSender: string;
	idPost: string;
	type: typeNotification;
	title?: string;
}

export interface GetNumberPeopleI {
	idUser?: string;
	idPost: string;
	type: typeNotification;
}
