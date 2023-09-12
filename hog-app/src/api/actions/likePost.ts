import axios from "../../lib/axios";

export const likePost = async (idPost: string): Promise<void> => {
    await axios.post("/user/like", {
        idPost,
    });
};
