import apiCaller from "../api-config/apiCaller";

export const login = async (email: string, password: string) => {
    const path = "auth/login";

    const data = {
        email,
        password,
    };

    const response = await apiCaller("POST", path, data);
    return response;
};

export const getMe = async () => {
    const path = "auth/me";

    const response = await apiCaller("GET", path);

    return response;
};

export const refreshToken = async () => {
    const path = "auth/refresh";

    const response = await apiCaller("GET", path);

    return response;
};