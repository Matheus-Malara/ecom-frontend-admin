export function setTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
}

export function getAccessToken(): string | null {
    return localStorage.getItem("accessToken");
}

export function getRefreshToken(): string | null {
    return localStorage.getItem("refreshToken");
}

export function clearTokens() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
}

export function logout() {
    clearTokens();
    window.location.href = "/login";
}
