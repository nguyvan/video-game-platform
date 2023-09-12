import axios from "../../lib/axios";

interface RequestLoginI {
    username: string;
    password: string;
}

interface RequestLoginReturnI {
    token: string;
    exp: string;
}

export const requestLogin = async ({
    username,
    password,
}: RequestLoginI): Promise<RequestLoginReturnI> => {
    const response = await axios.post<RequestLoginReturnI>("/auth/login", {
        username,
        password,
    });
    return { ...response.data };
};
