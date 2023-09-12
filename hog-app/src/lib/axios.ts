import axios from "axios";
import { InternalAxiosRequestConfig } from "axios";
import { Auth } from "./auth";
import { isExcludedUrl } from "../utils/auth.util";
import { refreshToken } from "../api/auth/refreshToken";
import { typeToken } from "../types/token";
import { StatusCodes } from "http-status-codes";
import { appConfig } from "../config/app.config";

async function authRequestInterceptor(config: InternalAxiosRequestConfig) {
    config.headers!.Accept = "application/json";
    const token = Auth.get();
    const serverUrl = config.url!;
    if (isExcludedUrl(serverUrl)) {
        return config;
    }

    if (token) {
        try {
            await refreshToken();
            config.headers!.authorization = `Bearer ${Auth.get(
                typeToken.ACCESS_TOKEN
            )}`;
        } catch {
            Auth.removeAuthData();
        }
    }
    return config;
}

async function handleAuthResponseInterceptor(error: any) {
    const serverURL = error.config.url;
    if (isExcludedUrl(serverURL)) {
        throw error;
    }
    const token = Auth.get();
    if (error.response?.status === StatusCodes.FORBIDDEN && token) {
        try {
            await refreshToken();
            const config = error.config;
            config.headers.authorization = `Bearer ${Auth.get()}`;
            return axios.request(config);
        } catch {
            Auth.removeAuthData();
        }
    }
    throw error;
}

const instance = axios.create({
    baseURL: appConfig.BASE_URL + "/api",
    withCredentials: true,
});

instance.interceptors.request.use(authRequestInterceptor, (error) =>
    Promise.reject(error)
);

instance.interceptors.response.use(
    (response) => response,
    handleAuthResponseInterceptor
);

export default instance;
