import axios from "axios";
import { Auth } from "../../lib/auth";
import { typeToken } from "../../types/token";
import { hasTokenExpired } from "../../utils/auth.util";

interface ExchangeTokenReturnI {
    token: string;
    exp: string;
}

export const refreshToken = async () => {
    const token = Auth.get();
    const exp = Auth.get(typeToken.EXP_ACCESS_TOKEN);
    if (!token || !exp) {
        return;
    }
    if (hasTokenExpired(exp)) {
        try {
            const response = await axios.post<ExchangeTokenReturnI>(
                "/api/auth/refresh_token"
            );
            if (response.status === 200) {
                Auth.set(typeToken.ACCESS_TOKEN, response.data.token);
                Auth.set(typeToken.EXP_ACCESS_TOKEN, response.data.exp);
            }
        } catch (err) {
            // eslint-disable-next-line no-console
            window.location.href = "/";
            throw new Error("Authorization failed");
        }
    }
};
