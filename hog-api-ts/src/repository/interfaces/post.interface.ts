import { UserReturnI } from "./user.interface";

export interface PostCreateI {
	idUser: string;
	title: string;
	urlImage?: string;
	urlVideo?: string;
}

export interface GetPostI {
	idUser?: string;
	skip?: number;
	idOwnUser: string;
}

export interface GetPostByIdI extends GetPostI {
	id?: string | null;
}

export interface ReturnPostI {
	_id: string;
	urlVideo: string;
	urlImage: string;
	idUser: string;
	title: string;
	date: Date;
	user: UserReturnI;
	isLiked: boolean;
	nbComments: number;
	nbLikes: number;
	nbShares: number;
}

export interface ReturnCommentI {
	_id: string;
	idUser: string;
	idPost: string;
	content: string;
	date: Date;
	user: UserReturnI;
}
