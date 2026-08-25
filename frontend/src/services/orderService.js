import api from "./api";

export const createOrder = async (shippingAddress) => {
    const response = await api.post("/api/orders", {
        shippingAddress
    });

    return response.data;
};

export const getMyOrders = async () => {
    const response = await api.get("/api/orders");

    return response.data;
};

export const getOrderById = async (orderId) => {
    const response = await api.get(
        `/api/orders/${orderId}`
    );

    return response.data;
};

export const cancelOrder = async (orderId) => {
    await api.put(
        `/api/orders/${orderId}/cancel`
    );
};