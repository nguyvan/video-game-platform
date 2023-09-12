import axios from "../../lib/axios";

export const createPost = async (formData: FormData): Promise<void> => {
    await axios.post("/user/create/post", formData);
};
