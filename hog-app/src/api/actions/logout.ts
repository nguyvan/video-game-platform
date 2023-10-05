import axios from "../../lib/axios";

export const Logout = async (): Promise<void> => {
    await axios.post("/auth/logout");
};
