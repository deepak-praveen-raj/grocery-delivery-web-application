import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    createOrder,
    getMyOrders
} from "../services/orderService";

import {
    createPayment,
    getPaymentByOrderId,
    verifyPayment
} from "../services/paymentService";


function Checkout() {

    const [shippingAddress, setShippingAddress] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();


    // =====================================================
    // HANDLE CHECKOUT
    // =====================================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        if (!shippingAddress.trim()) {
            setError("Shipping address is required");
            return;
        }

        setLoading(true);
        setError("");


        try {

            // =================================================
            // 1. GET USER ORDERS
            // =================================================

            const orders = await getMyOrders();

            console.log("My orders:", orders);


            // =================================================
            // 2. FIND PENDING ORDER
            // =================================================

            let pendingOrder = orders.find(
                (order) =>
                    order.status === "PENDING"
            );


            // =================================================
            // 3. CREATE ORDER IF NO PENDING ORDER
            // =================================================

            if (!pendingOrder) {

                pendingOrder =
                    await createOrder(
                        shippingAddress.trim()
                    );

                console.log(
                    "New order created:",
                    pendingOrder
                );

            } else {

                console.log(
                    "Using existing pending order:",
                    pendingOrder
                );
            }


            // =================================================
            // 4. GET EXISTING PAYMENT
            // =================================================

            let payment = null;


            try {

                payment =
                    await getPaymentByOrderId(
                        pendingOrder.id
                    );

                console.log(
                    "Existing payment:",
                    payment
                );

            } catch (paymentError) {

                console.log(
                    "No existing payment found."
                );

                payment = null;
            }


            // =================================================
            // 5. IF PAYMENT EXISTS
            // =================================================

            if (payment) {

                // ---------------------------------------------
                // Already paid
                // ---------------------------------------------

                if (payment.status === "PAID") {

                    setError(
                        "This order has already been paid."
                    );

                    setLoading(false);

                    return;
                }


                // ---------------------------------------------
                // Payment exists but Razorpay order ID missing
                // ---------------------------------------------

                if (!payment.razorpayOrderId) {

                    setError(
                        "Razorpay Order ID is missing."
                    );

                    setLoading(false);

                    return;
                }

            } else {

                // =================================================
                // 6. CREATE PAYMENT
                // =================================================

                payment =
                    await createPayment(
                        pendingOrder.id
                    );

                console.log(
                    "New payment created:",
                    payment
                );
            }


            // =================================================
            // 7. VALIDATE PAYMENT
            // =================================================

            if (!payment) {

                throw new Error(
                    "Payment information not available"
                );
            }


            if (!payment.razorpayOrderId) {

                throw new Error(
                    "Razorpay Order ID not available"
                );
            }


            if (!payment.amount) {

                throw new Error(
                    "Payment amount not available"
                );
            }


            // =================================================
            // 8. OPEN RAZORPAY
            // =================================================

            openRazorpayCheckout(
                pendingOrder,
                payment
            );


        } catch (error) {

            console.error(
                "Checkout failed:",
                error
            );


            const message =
                error.response?.data?.message ||
                error.response?.data ||
                error.message ||
                "Failed to start checkout";


            setError(
                String(message)
            );


            setLoading(false);
        }
    };


    // =====================================================
    // OPEN RAZORPAY CHECKOUT
    // =====================================================

    const openRazorpayCheckout = (
        order,
        payment
    ) => {

        // =================================================
        // CHECK RAZORPAY SCRIPT
        // =================================================

        if (!window.Razorpay) {

            setError(
                "Razorpay Checkout failed to load."
            );

            setLoading(false);

            return;
        }


        // =================================================
        // RAZORPAY KEY
        // =================================================

        const razorpayKey =
            import.meta.env.VITE_RAZORPAY_KEY_ID;


        if (!razorpayKey) {

            setError(
                "Razorpay Key ID is missing."
            );

            setLoading(false);

            return;
        }


        // =================================================
        // AMOUNT
        // =================================================

        const amountInPaise =
            Math.round(
                Number(payment.amount) * 100
            );


        // =================================================
        // RAZORPAY OPTIONS
        // =================================================

        const options = {

            key: razorpayKey,

            amount: amountInPaise,

            currency: "INR",

            name: "Grocery Delivery",

            description:
                `Payment for Order #${order.id}`,

            order_id:
                payment.razorpayOrderId,


            // =================================================
            // PAYMENT SUCCESS
            // =================================================

            handler: async function (response) {

                console.log(
                    "================================="
                );

                console.log(
                    "RAZORPAY PAYMENT SUCCESS"
                );

                console.log(
                    "Payment ID:",
                    response.razorpay_payment_id
                );

                console.log(
                    "Order ID:",
                    response.razorpay_order_id
                );

                console.log(
                    "Signature:",
                    response.razorpay_signature
                );

                console.log(
                    "================================="
                );


                try {

                    setError("");


                    // =========================================
                    // VALIDATE RAZORPAY RESPONSE
                    // =========================================

                    if (
                        !response.razorpay_payment_id ||
                        !response.razorpay_order_id ||
                        !response.razorpay_signature
                    ) {

                        throw new Error(
                            "Invalid Razorpay payment response"
                        );
                    }


                    // =========================================
                    // VERIFY PAYMENT WITH BACKEND
                    // =========================================

                    console.log(
                        "Sending verification request..."
                    );


                    const verification =
                        await verifyPayment({

                            orderId:
                                order.id,

                            razorpayPaymentId:
                                response.razorpay_payment_id,

                            razorpayOrderId:
                                response.razorpay_order_id,

                            razorpaySignature:
                                response.razorpay_signature

                        });


                    console.log(
                        "Backend verification response:",
                        verification
                    );


                    // =========================================
                    // CHECK BACKEND PAYMENT STATUS
                    // =========================================

                    if (
                        !verification ||
                        verification.status !== "PAID"
                    ) {

                        throw new Error(
                            "Payment verification failed. Payment is not marked as PAID."
                        );
                    }


                    // =========================================
                    // PAYMENT SUCCESS
                    // =========================================

                    setLoading(false);

                    alert(
                        "Payment successful!"
                    );


                    // =========================================
                    // GO TO SUCCESS PAGE
                    // =========================================

                    navigate(
                        "/orders/success",
                        {
                            state: {
                                orderId: order.id
                            }
                        }
                    );


                } catch (verificationError) {

                    console.error(
                        "================================="
                    );

                    console.error(
                        "PAYMENT VERIFICATION FAILED"
                    );

                    console.error(
                        verificationError
                    );

                    console.error(
                        "================================="
                    );


                    const message =
                        verificationError
                            .response
                            ?.data
                            ?.message ||
                        verificationError
                            .response
                            ?.data ||
                        verificationError.message ||
                        "Payment verification failed";


                    setError(
                        String(message)
                    );


                    setLoading(false);
                }
            },


            // =================================================
            // PREFILL
            // =================================================

            prefill: {

                name: "",

                email: "",

                contact: ""
            },


            // =================================================
            // THEME
            // =================================================

            theme: {

                color: "#3399cc"
            }
        };


        // =================================================
        // DEBUG INFORMATION
        // =================================================

        console.log(
            "================================="
        );

        console.log(
            "RAZORPAY CHECKOUT"
        );

        console.log(
            "Key:",
            razorpayKey
        );

        console.log(
            "Amount:",
            amountInPaise
        );

        console.log(
            "Currency:",
            options.currency
        );

        console.log(
            "Application Order ID:",
            order.id
        );

        console.log(
            "Razorpay Order ID:",
            payment.razorpayOrderId
        );

        console.log(
            "================================="
        );


        // =================================================
        // CREATE RAZORPAY INSTANCE
        // =================================================

        const razorpay =
            new window.Razorpay(options);


        // =================================================
        // PAYMENT FAILED
        // =================================================

        razorpay.on(
            "payment.failed",
            function (response) {

                console.error(
                    "Razorpay payment failed:",
                    response.error
                );


                setError(
                    response.error?.description ||
                    "Payment failed"
                );


                setLoading(false);
            }
        );


        // =================================================
        // OPEN RAZORPAY
        // =================================================

        razorpay.open();
    };


    // =====================================================
    // UI
    // =====================================================

    return (

        <div>

            <h1>
                Checkout
            </h1>


            <form
                onSubmit={handleSubmit}
            >

                <div>

                    <label>
                        Shipping Address
                    </label>

                    <br />


                    <textarea
                        value={shippingAddress}
                        onChange={(event) =>
                            setShippingAddress(
                                event.target.value
                            )
                        }
                        placeholder="Enter your shipping address"
                        rows="5"
                        required
                    />

                </div>


                <br />


                {error && (

                    <p>
                        {error}
                    </p>

                )}


                <br />


                <button
                    type="submit"
                    disabled={loading}
                >

                    {loading
                        ? "Processing..."
                        : "Pay with Razorpay"}

                </button>

            </form>

        </div>
    );
}


export default Checkout;