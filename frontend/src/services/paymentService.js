import api from "./api";

export const createPayment = async (orderId) => {
    const response = await api.post("/api/payments", {
        orderId,
        paymentMethod: "RAZORPAY"
    });

    return response.data;
};

export const getPaymentByOrderId = async (orderId) => {
    const response = await api.get(
        `/api/payments/order/${orderId}`
    );

    return response.data;
};

export const verifyPayment = async ({
    orderId,
    razorpayPaymentId,
    razorpayOrderId,
    razorpaySignature
}) => {
    const response = await api.post(
        "/api/payments/verify",
        {
            orderId,
            razorpayPaymentId,
            razorpayOrderId,
            razorpaySignature
        }
    );

    return response.data;
};