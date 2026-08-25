import api from "./api";

export const registerUser = async (registerData) => {
    const response = await api.post(
        "/api/auth/register",
        registerData
    );

    return response.data;
};

export const loginUser = async (loginData) => {
    const response = await api.post(
        "/api/auth/login",
        loginData
    );

    return response.data;
};