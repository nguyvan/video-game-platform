import axios from "../../lib/axios";

interface RequestSignUpI {
    username: string;
    email: string;
    password: string;
}

export const requestSignup = async ({
    username,
    email,
    password,
}: RequestSignUpI): Promise<void> => {
    await axios.post<void>("/auth/signup", {
        username,
        password,
        email,
    });
};
