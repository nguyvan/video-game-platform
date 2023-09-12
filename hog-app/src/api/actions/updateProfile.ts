import axios from "../../lib/axios";

export const updateProfile = async (formData: FormData): Promise<void> => {
    await axios.patch("/user/profile/update", formData);
};
