import axios from "../../lib/axios";

export interface PostReturnI {
    _id: string;
    title: string;
    date: string;
    user: {
        _id: string;
        username: string;
        email: string;
    };
    isLiked: boolean;
    nbComments: number;
    nbLikes: number;
    nbShares: number;
    urlVideo: string;
    urlImage: string;
    idUser: string;
}

export const getPostById = async (id?: string | null): Promise<PostReturnI> => {
    const response = await axios.get<{ post: PostReturnI }>("/user/post", {
        params: {
            idPost: id,
        },
    });
    return response.data.post;
};

export const getPosts = async (
    skip: number,
    isAll: boolean,
    idUser?: string | null
): Promise<PostReturnI[]> => {
    const response = await axios.get<{ posts: PostReturnI[] }>("/user/posts", {
        params: {
            skip,
            isAll,
            idUser,
        },
    });
    return response.data.posts;
};
