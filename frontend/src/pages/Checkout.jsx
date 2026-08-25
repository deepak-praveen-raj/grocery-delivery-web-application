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



    const handleSubmit = async (event) => {

        event.preventDefault();

        setLoading(true);
        setError("");

        try {

            // ==========================================
            // 1. GET USER'S EXISTING ORDERS
            // ==========================================

            const orders = await getMyOrders();

            console.log(
                "User orders:",
                orders
            );


            // ==========================================
            // 2. FIND EXISTING PENDING ORDER
            // ==========================================

            let pendingOrder = orders.find(
                (order) =>
                    order.status === "PENDING"
            );


            // ==========================================
            // 3. CREATE NEW ORDER IF NONE EXISTS
            // ==========================================

            if (!pendingOrder) {

                pendingOrder = await createOrder(
                    shippingAddress
                );

                console.log(
                    "New order created:",
                    pendingOrder
                );

            } else {

                console.log(
                    "Existing pending order found:",
                    pendingOrder
                );
            }


            // ==========================================
            // 4. GET EXISTING PAYMENT
            //    OR CREATE NEW PAYMENT
            // ==========================================

            let payment;

            try {

                // Try to get an existing payment
                payment =
                    await getPaymentByOrderId(
                        pendingOrder.id
                    );

                console.log(
                    "Existing payment found:",
                    payment
                );

            } catch (paymentError) {

                console.log(
                    "No existing payment found. Creating payment..."
                );

                payment =
                    await createPayment(
                        pendingOrder.id
                    );

                console.log(
                    "New payment created:",
                    payment
                );
            }


            // ==========================================
            // 5. CHECK PAYMENT DATA
            // ==========================================

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


            // ==========================================
            // 6. OPEN RAZORPAY CHECKOUT
            // ==========================================

            openRazorpayCheckout(
                pendingOrder,
                payment
            );

        } catch (error) {

            console.error(
                "Checkout failed:",
                error.response?.data ||
                error.message ||
                error
            );


            const backendMessage =
                error.response?.data?.message ||
                error.response?.data;


            setError(
                backendMessage ||
                error.message ||
                "Failed to start checkout"
            );

            setLoading(false);
        }
    };



    // ==================================================
    // RAZORPAY CHECKOUT
    // ==================================================

    const openRazorpayCheckout = (
        order,
        payment
    ) => {

        // ----------------------------------------------
        // Check Razorpay script
        // ----------------------------------------------

        if (!window.Razorpay) {

            setError(
                "Razorpay Checkout failed to load. Please refresh the page."
            );

            setLoading(false);

            return;
        }


        // ----------------------------------------------
        // Check Razorpay Key
        // ----------------------------------------------

        const razorpayKey =
            import.meta.env.VITE_RAZORPAY_KEY_ID;


        if (!razorpayKey) {

            setError(
                "Razorpay Key ID is missing."
            );

            setLoading(false);

            return;
        }


        // ----------------------------------------------
        // Create Razorpay options
        // ----------------------------------------------

        const options = {

            key: razorpayKey,

            amount:
                Math.round(
                    Number(payment.amount) * 100
                ),

            currency: "INR",

            name: "Grocery Delivery",

            description:
                `Payment for Order #${order.id}`,

            order_id:
                payment.razorpayOrderId,


            // ------------------------------------------
            // PAYMENT SUCCESS
            // ------------------------------------------

            handler: async function (response) {

                console.log(
                    "Razorpay payment response:",
                    response
                );


                try {

                    setError("");


                    // ----------------------------------
                    // Verify payment in backend
                    // ----------------------------------

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
                        "Payment verification successful:",
                        verification
                    );


                    // ----------------------------------
                    // Payment successful
                    // ----------------------------------

                    setLoading(false);

                    navigate("/orders/success", {
                        state: {
                            orderId: order.id
                        }
                    });


                } catch (verificationError) {

                    console.error(
                        "Payment verification failed:",
                        verificationError.response?.data ||
                        verificationError.message
                    );


                    setError(
                        verificationError.response?.data?.message ||
                        verificationError.response?.data ||
                        "Payment verification failed"
                    );


                    setLoading(false);
                }
            },


            // ------------------------------------------
            // PREFILL
            // ------------------------------------------

            prefill: {

                name: "",

                email: "",

                contact: ""
            },


            // ------------------------------------------
            // THEME
            // ------------------------------------------

            theme: {

                color: "#3399cc"
            }
        };


        // ----------------------------------------------
        // Create Razorpay instance
        // ----------------------------------------------

        const razorpay =
            new window.Razorpay(options);


        // ----------------------------------------------
        // PAYMENT FAILED
        // ----------------------------------------------

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


        // ----------------------------------------------
        // OPEN RAZORPAY
        // ----------------------------------------------

        razorpay.open();
    };



    // ==================================================
    // UI
    // ==================================================

    return (

        <div>

            <h1>Checkout</h1>


            <form onSubmit={handleSubmit}>

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