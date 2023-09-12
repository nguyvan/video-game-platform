import axios from "../../lib/axios";

export const sharePost = async (
    idReceivers: string[],
    idPost: string
): Promise<void> => {
    await axios.post("/user/share", {
        idReceivers,
        idPost,
    });
};
