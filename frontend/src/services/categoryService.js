import api from "./api";

export const getAllCategories = async () => {

    const response = await api.get(
        "/api/categories/allCategories"
    );

    return response.data;
};