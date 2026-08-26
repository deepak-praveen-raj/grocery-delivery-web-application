import api from "./api";

export const getProducts = async (
    page = 0,
    size = 8,
    sortBy = "name",
    direction = "asc"
) => {

    const response = await api.get(
        "/api/products",
        {
            params: {
                page,
                size,
                sortBy,
                direction
            }
        }
    );

    return response.data;
};


export const getProductById = async (productId) => {

    const response = await api.get(
        `/api/products/${productId}`
    );

    return response.data;
};


export const filterProducts = async ({
    keyword = "",
    categoryId = "",
    minPrice = "",
    maxPrice = "",
    page = 0,
    size = 8,
    sortBy = "name",
    direction = "asc"
}) => {

    const params = {
        page,
        size,
        sortBy,
        direction
    };


    if (keyword.trim()) {
        params.keyword = keyword.trim();
    }

    if (categoryId) {
        params.categoryId = categoryId;
    }

    if (minPrice !== "") {
        params.minPrice = minPrice;
    }

    if (maxPrice !== "") {
        params.maxPrice = maxPrice;
    }


    const response = await api.get(
        "/api/products/filter-products",
        {
            params
        }
    );

    return response.data;
};