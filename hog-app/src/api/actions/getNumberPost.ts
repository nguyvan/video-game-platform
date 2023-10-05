import axios from "../../lib/axios";

export const getNumberPost = async (idUser: string): Promise<number> => {
    const response = await axios.get<{ nbPost: number }>("/user/number/post", {
        params: {
            idUser,
        },
    });

    return response.data.nbPost;
};
