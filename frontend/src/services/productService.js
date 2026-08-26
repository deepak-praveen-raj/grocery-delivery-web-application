import api from "./api";

export const getProducts = async () => {
    const response = await api.get("/api/products");

    return response.data;
};

export const getProductById = async (productId) => {
    const response = await api.get(
        `/api/products/${productId}`
    );

    return response.data;
};