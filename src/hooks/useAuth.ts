import {useState} from "react";
import {loginUser} from "@/services/authApi.ts";
import {setTokens, clearTokens, getAccessToken} from "@/services/authStorage.ts";

export function useAuth() {
    const [loading, setLoading] = useState(false);

    async function login(email: string, password: string) {
        setLoading(true);
        try {
            const {accessToken, refreshToken} = await loginUser({email, password});
            setTokens(accessToken, refreshToken);
        } finally {
            setLoading(false);
        }
    }

    function logout() {
        clearTokens();
        window.location.href = "/login";
    }

    return {
        login,
        logout,
        loading,
        isAuthenticated: !!getAccessToken(),
    };
}
