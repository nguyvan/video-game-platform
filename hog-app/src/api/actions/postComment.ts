import axios from "../../lib/axios";

export const postComment = async (
    idPost: string,
    content: string
): Promise<void> => {
    await axios.post("/user/create/comment", {
        idPost,
        content,
    });
};
