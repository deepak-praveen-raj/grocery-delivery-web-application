import api from "./api";

export const loginUser = async (loginRequest) => {
    const response = await api.post(
        "/api/auth/login",
        loginRequest
    );

    return response.data;
};

export const registerUser = async (registerRequest) => {
    const response = await api.post(
        "/api/auth/register",
        registerRequest
    );

    return response.data;
};