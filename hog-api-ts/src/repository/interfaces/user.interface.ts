import { typeNotification } from "@/database/constant/config.mongo";

export interface CreateUserI {
	username: string;
	email: string;
	password: string;
	urlImage?: string;
	bio?: string;
}

export interface UserReturnI {
	_id: string;
	username: string;
	email: string;
	salt?: string;
	password?: string;
	urlImage?: string;
	bio?: string;
}

export interface GetUserBySearchI {
	search: string;
	skip?: number;
	withPassword: boolean;
	id?: string;
}

export interface UpdateInfoI {
	id: string;
	urlImage?: string;
	bio?: string;
	username?: string;
}

export interface PostCommentI {
	idUser: string;
	idPost: string;
	content: string;
}

export interface LikePostI {
	idUser: string;
	idPost: string;
}

export interface GetByIdI {
	id: string;
	skip?: number;
}

export interface GetNotifByIdI extends GetByIdI {
	isLiked?: boolean;
}

export interface GetNotifReturnI {
	_id: string;
	idUser: string;
	idSender: string;
	idPost: string;
	isViewed: boolean;
	isClicked: boolean;
	type: typeNotification;
	title: string;
	date: Date;
	user: UserReturnI;
}

export interface SharePostI {
	id: string;
	idReceiver: string;
	idPost: string;
}
