import api from "@/services/axiosInstance";
import type {StandardResponse} from "@/types/api-response";

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}

export async function loginUser(data: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<StandardResponse<LoginResponse>>("/auth/login", data);
    return response.data.data;
}

export async function refreshToken(refreshToken: string): Promise<LoginResponse> {
    const response = await api.post<StandardResponse<LoginResponse>>("/auth/refresh", { refreshToken });
    return response.data.data;
}
