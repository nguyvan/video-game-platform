import axios from "../../lib/axios";
import { UserReturnI } from "../new-feed/getUser";

export const getUsers = async (
    skip?: number,
    search?: string
): Promise<UserReturnI[]> => {
    const response = await axios.get<{ users: UserReturnI[] }>("/user", {
        params: {
            skip,
            search,
        },
    });

    return response.data.users;
};
