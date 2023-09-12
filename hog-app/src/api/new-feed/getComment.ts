import axios from "../../lib/axios";

export interface CommentReturnI {
    _id: string;
    idUser: string;
    idPost: string;
    content: string;
    date: string;
    user: {
        _id: string;
        username: string;
        email: string;
        urlImage: string;
        bio: string;
    };
}

export const getComments = async (
    id: string,
    skip?: number
): Promise<CommentReturnI[]> => {
    const response = await axios.get<{ comments: CommentReturnI[] }>(
        "/user/comments",
        {
            params: {
                idPost: id,
                skip,
            },
        }
    );
    return response.data.comments;
};
