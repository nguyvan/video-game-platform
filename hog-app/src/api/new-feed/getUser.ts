import axios from "../../lib/axios";

export interface UserReturnI {
    _id: string;
    username: string;
    email: string;
    urlImage: string;
    bio: string;
}

export const getUserById = async (id?: string | null): Promise<UserReturnI> => {
    const response = await axios.get<{ user: UserReturnI }>("/user/profile", {
        params: {
            id: id,
        },
    });
    return response.data.user;
};
