import axios from "axios";
import type {AxiosRequestConfig} from "axios";
import {
    getAccessToken,
    getRefreshToken,
    setTokens,
    clearTokens,
} from "@/services/authStorage";
import {refreshToken} from "@/services/authApi";

const api = axios.create({baseURL: "/api"});

let isRefreshing = false;
let failedQueue: { resolve: (token: string) => void; reject: (err: unknown) => void }[] = [];

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
    _retry?: boolean;
}

function processQueue(error: unknown, token: string | null = null): void {
    failedQueue.forEach((prom) => {
        if (error) prom.reject(error);
        else prom.resolve(token!);
    });
    failedQueue = [];
}


api.interceptors.request.use(
    (config) => {
        const token = getAccessToken();
        const isRefreshEndpoint = config.url?.includes("/auth/refresh");

        if (token && !isRefreshEndpoint) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config as CustomAxiosRequestConfig;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            getRefreshToken()
        ) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({resolve, reject});
                })
                    .then((token) => {
                        originalRequest.headers = {
                            ...originalRequest.headers,
                            Authorization: `Bearer ${token}`,
                        };

                        return api(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const newTokens = await refreshToken(getRefreshToken()!);
                setTokens(newTokens.accessToken, newTokens.refreshToken);
                processQueue(null, newTokens.accessToken);
                originalRequest.headers = {
                    ...originalRequest.headers,
                    Authorization: `Bearer ${newTokens.accessToken}`,
                };

                return api(originalRequest);
            } catch (err) {
                processQueue(err, null);
                clearTokens();
                window.location.href = "/login";
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;
