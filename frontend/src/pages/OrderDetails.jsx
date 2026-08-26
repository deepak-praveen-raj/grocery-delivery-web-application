import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    getOrderById,
    cancelOrder
} from "../services/orderService";


function OrderDetails() {

    const { orderId } = useParams();

    const navigate = useNavigate();

    const [order, setOrder] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [cancelling, setCancelling] = useState(false);


    // =====================================================
    // LOAD ORDER
    // =====================================================

    const loadOrder = async () => {

        try {

            setLoading(true);

            setError("");

            const data =
                await getOrderById(orderId);

            setOrder(data);

        } catch (error) {

            console.error(
                "Failed to load order:",
                error.response?.data ||
                error.message
            );

            setError(
                error.response?.data?.message ||
                "Failed to load order."
            );

        } finally {

            setLoading(false);
        }
    };


    useEffect(() => {

        loadOrder();

    }, [orderId]);


    // =====================================================
    // CANCEL ORDER
    // =====================================================

    const handleCancelOrder = async () => {

        const confirmed =
            window.confirm(
                `Are you sure you want to cancel Order #${order.id}?`
            );

        if (!confirmed) {
            return;
        }


        try {

            setCancelling(true);

            setError("");

            await cancelOrder(order.id);

            // Reload order so backend status is displayed
            await loadOrder();

            alert(
                "Order cancelled successfully."
            );

        } catch (error) {

            console.error(
                "Failed to cancel order:",
                error.response?.data ||
                error.message
            );

            setError(
                error.response?.data?.message ||
                "Failed to cancel order."
            );

        } finally {

            setCancelling(false);
        }
    };


    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (date) => {

        if (!date) {
            return "Unavailable";
        }

        return new Date(date).toLocaleString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        );
    };


    // =====================================================
    // STATUS CLASS
    // =====================================================

    const getOrderStatusClass = (status) => {

        switch (status) {

            case "CONFIRMED":
                return "status-confirmed";

            case "PENDING":
                return "status-pending";

            case "CANCELLED":
                return "status-cancelled";

            case "SHIPPED":
                return "status-shipped";

            case "DELIVERED":
                return "status-delivered";

            default:
                return "status-default";
        }
    };


    const getPaymentStatusClass = (status) => {

        switch (status) {

            case "PAID":
                return "payment-paid";

            case "PENDING":
                return "payment-pending";

            case "FAILED":
                return "payment-failed";

            default:
                return "payment-default";
        }
    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="order-details-loading">

                <div className="loading-spinner"></div>

                <p>
                    Loading order details...
                </p>

            </div>
        );
    }


    // =====================================================
    // ERROR
    // =====================================================

    if (error && !order) {

        return (

            <div className="order-details-error">

                <div className="order-error-icon">
                    !
                </div>

                <h2>
                    Unable to load order
                </h2>

                <p>
                    {error}
                </p>

                <button
                    onClick={() =>
                        navigate("/orders")
                    }
                >
                    ← Back to Orders
                </button>

            </div>
        );
    }


    // =====================================================
    // ORDER NOT FOUND
    // =====================================================

    if (!order) {

        return (

            <div className="order-details-error">

                <div className="order-error-icon">
                    ?
                </div>

                <h2>
                    Order not found
                </h2>

                <button
                    onClick={() =>
                        navigate("/orders")
                    }
                >
                    ← Back to Orders
                </button>

            </div>
        );
    }


    // =====================================================
    // PAGE
    // =====================================================

    return (

        <div className="order-details-page">


            {/* ==========================================
                BACK BUTTON
            ========================================== */}

            <div className="order-details-container">

                <button
                    className="back-orders-button"
                    onClick={() =>
                        navigate("/orders")
                    }
                >
                    ← Back to Orders
                </button>


                {/* ======================================
                    HEADER
                ====================================== */}

                <div className="order-details-header">

                    <div>

                        <span className="section-label">
                            ORDER DETAILS
                        </span>

                        <h1>
                            Order #{order.id}
                        </h1>

                        <p>
                            Placed on{" "}
                            {formatDate(
                                order.createdAt
                            )}
                        </p>

                    </div>


                    <div className="order-header-status">

                        <span
                            className={`status-badge ${getOrderStatusClass(
                                order.status
                            )}`}
                        >

                            <span className="status-dot"></span>

                            {order.status}

                        </span>

                    </div>

                </div>


                {/* ======================================
                    ERROR AFTER ORDER EXISTS
                ====================================== */}

                {error && (

                    <div className="order-inline-error">

                        <span>
                            !
                        </span>

                        <p>
                            {error}
                        </p>

                    </div>

                )}


                {/* ======================================
                    MAIN GRID
                ====================================== */}

                <div className="order-details-grid">


                    {/* ==================================
                        LEFT COLUMN
                    ================================== */}

                    <div className="order-details-main">


                        {/* =================================
                            ORDER ITEMS
                        ================================= */}

                        <section className="details-card">

                            <div className="details-card-header">

                                <div>

                                    <h2>
                                        Order Items
                                    </h2>

                                    <p>
                                        {order.items?.length || 0}{" "}
                                        {order.items?.length === 1
                                            ? "item"
                                            : "items"}{" "}
                                        in this order
                                    </p>

                                </div>

                            </div>


                            <div className="details-items">

                                {order.items &&
                                order.items.length > 0 ? (

                                    order.items.map((item) => (

                                        <div
                                            className="details-item"
                                            key={item.id}
                                        >

                                            <div className="details-item-icon">
                                                🛒
                                            </div>


                                            <div className="details-item-info">

                                                <h3>
                                                    {item.productName}
                                                </h3>

                                                <p>
                                                    Quantity:{" "}
                                                    {item.quantity}
                                                </p>

                                                <span>
                                                    ₹
                                                    {Number(
                                                        item.unitPrice
                                                    ).toFixed(2)}
                                                    {" "}each
                                                </span>

                                            </div>


                                            <div className="details-item-total">

                                                ₹
                                                {Number(
                                                    item.subtotal
                                                ).toFixed(2)}

                                            </div>

                                        </div>

                                    ))

                                ) : (

                                    <div className="no-order-items">

                                        <p>
                                            No items found for
                                            this order.
                                        </p>

                                    </div>

                                )}

                            </div>

                        </section>


                        {/* =================================
                            DELIVERY ADDRESS
                        ================================= */}

                        <section className="details-card">

                            <div className="details-card-header">

                                <div>

                                    <h2>
                                        Delivery Address
                                    </h2>

                                    <p>
                                        Your order will be
                                        delivered here.
                                    </p>

                                </div>

                            </div>


                            <div className="delivery-address">

                                <div className="address-icon">
                                    📍
                                </div>

                                <p>
                                    {order.shippingAddress ||
                                        "Address unavailable"}
                                </p>

                            </div>

                        </section>


                        {/* =================================
                            ORDER TIMELINE
                        ================================= */}

                        <section className="details-card">

                            <div className="details-card-header">

                                <div>

                                    <h2>
                                        Order Status
                                    </h2>

                                    <p>
                                        Current status of your order.
                                    </p>

                                </div>

                            </div>


                            <div className="order-status-timeline">

                                <div className="timeline-item active">

                                    <div className="timeline-icon">
                                        ✓
                                    </div>

                                    <div>

                                        <strong>
                                            Order Placed
                                        </strong>

                                        <p>
                                            Your order has been created.
                                        </p>

                                    </div>

                                </div>


                                <div
                                    className={`timeline-item ${
                                        order.status === "CONFIRMED" ||
                                        order.status === "SHIPPED" ||
                                        order.status === "DELIVERED"
                                            ? "active"
                                            : ""
                                    }`}
                                >

                                    <div className="timeline-icon">
                                        ✓
                                    </div>

                                    <div>

                                        <strong>
                                            Order Confirmed
                                        </strong>

                                        <p>
                                            Payment has been confirmed.
                                        </p>

                                    </div>

                                </div>


                                <div
                                    className={`timeline-item ${
                                        order.status === "SHIPPED" ||
                                        order.status === "DELIVERED"
                                            ? "active"
                                            : ""
                                    }`}
                                >

                                    <div className="timeline-icon">
                                        ✓
                                    </div>

                                    <div>

                                        <strong>
                                            Shipped
                                        </strong>

                                        <p>
                                            Your order is on its way.
                                        </p>

                                    </div>

                                </div>


                                <div
                                    className={`timeline-item ${
                                        order.status === "DELIVERED"
                                            ? "active"
                                            : ""
                                    }`}
                                >

                                    <div className="timeline-icon">
                                        ✓
                                    </div>

                                    <div>

                                        <strong>
                                            Delivered
                                        </strong>

                                        <p>
                                            Order delivered successfully.
                                        </p>

                                    </div>

                                </div>

                            </div>

                        </section>

                    </div>


                    {/* ==================================
                        RIGHT COLUMN
                    ================================== */}

                    <aside className="order-details-sidebar">


                        {/* =================================
                            PAYMENT SUMMARY
                        ================================= */}

                        <section className="details-card summary-card">

                            <h2>
                                Order Summary
                            </h2>


                            <div className="details-summary-row">

                                <span>
                                    Order ID
                                </span>

                                <strong>
                                    #{order.id}
                                </strong>

                            </div>


                            <div className="details-summary-row">

                                <span>
                                    Order Status
                                </span>

                                <span
                                    className={`status-badge ${getOrderStatusClass(
                                        order.status
                                    )}`}
                                >

                                    <span className="status-dot"></span>

                                    {order.status}

                                </span>

                            </div>


                            <div className="details-summary-row">

                                <span>
                                    Payment Status
                                </span>

                                <span
                                    className={`status-badge ${getPaymentStatusClass(
                                        order.paymentStatus
                                    )}`}
                                >

                                    <span className="status-dot"></span>

                                    {order.paymentStatus}

                                </span>

                            </div>


                            <div className="details-summary-divider"></div>


                            <div className="details-total">

                                <span>
                                    Total
                                </span>

                                <strong>
                                    ₹
                                    {Number(
                                        order.totalAmount
                                    ).toFixed(2)}
                                </strong>

                            </div>

                        </section>


                        {/* =================================
                            PAYMENT INFORMATION
                        ================================= */}

                        <section className="details-card payment-info-card">

                            <h2>
                                Payment
                            </h2>

                            <div className="payment-method">

                                <div className="payment-method-icon">
                                    💳
                                </div>

                                <div>

                                    <strong>
                                        Razorpay
                                    </strong>

                                    <span>
                                        Secure online payment
                                    </span>

                                </div>

                            </div>

                        </section>


                        {/* =================================
                            CANCEL ORDER
                        ================================= */}

                        {order.status === "PENDING" && (

                            <section className="cancel-order-card">

                                <h3>
                                    Need to cancel?
                                </h3>

                                <p>
                                    You can cancel this order
                                    while it is still pending.
                                </p>

                                <button
                                    className="cancel-order-button"
                                    onClick={handleCancelOrder}
                                    disabled={cancelling}
                                >

                                    {cancelling
                                        ? "Cancelling..."
                                        : "Cancel Order"}

                                </button>

                            </section>

                        )}

                    </aside>

                </div>

            </div>

        </div>
    );
}


export default OrderDetails;