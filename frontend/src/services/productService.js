import api from "./api";

export const getProducts = async () => {
    const response = await api.get("/api/products");

    return response.data;
};