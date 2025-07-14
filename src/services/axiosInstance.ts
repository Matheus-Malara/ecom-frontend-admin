import axios from "axios";
import {getAccessToken, getRefreshToken, setTokens, clearTokens} from "@/services/authStorage";
import {refreshToken} from "@/services/authApi";

const api = axios.create({baseURL: "/api"});

let isRefreshing = false;
let failedQueue: any[] = [];

function processQueue(error: any, token: string | null = null) {
    failedQueue.forEach(prom => {
        if (error) prom.reject(error);
        else prom.resolve(token);
    });
    failedQueue = [];
}

api.interceptors.request.use(
    (config) => {
        const token = getAccessToken();
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise(function (resolve, reject) {
                    failedQueue.push({resolve, reject});
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
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
                originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
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
