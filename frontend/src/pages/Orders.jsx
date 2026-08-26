import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyOrders } from "../services/orderService";

function Orders() {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();


    // ==========================================
    // LOAD ORDERS
    // ==========================================

    const loadOrders = async () => {

        try {

            setLoading(true);
            setError("");

            const data = await getMyOrders();

            setOrders(data);

        } catch (error) {

            console.error(
                "Failed to load orders:",
                error.response?.data ||
                error.message
            );

            setError(
                error.response?.data?.message ||
                "Failed to load orders."
            );

        } finally {

            setLoading(false);
        }
    };


    useEffect(() => {

        loadOrders();

    }, []);


    // ==========================================
    // FORMAT DATE
    // ==========================================

    const formatDate = (date) => {

        if (!date) {
            return "Date unavailable";
        }

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );
    };


    // ==========================================
    // FORMAT ORDER NUMBER
    // ==========================================

    const getOrderNumber = (order) => {

        // Use backend orderNumber if available

        if (order.orderNumber) {
            return order.orderNumber;
        }

        // Fallback for old orders
        // Example:
        // id = 15 → ORD-00015

        return `ORD-${String(order.id).padStart(5, "0")}`;
    };


    // ==========================================
    // ORDER STATUS CLASS
    // ==========================================

    const getOrderStatusClass = (status) => {

        switch (status) {

            case "CONFIRMED":
                return "status-confirmed";

            case "PENDING":
                return "status-pending";

            case "CANCELLED":
                return "status-cancelled";

            case "DELIVERED":
                return "status-delivered";

            case "SHIPPED":
                return "status-shipped";

            default:
                return "status-default";
        }
    };


    // ==========================================
    // PAYMENT STATUS CLASS
    // ==========================================

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


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <div className="orders-loading">

                <div className="loading-spinner"></div>

                <p>
                    Loading your orders...
                </p>

            </div>
        );
    }


    // ==========================================
    // ERROR
    // ==========================================

    if (error) {

        return (

            <div className="orders-error">

                <div className="orders-error-icon">
                    !
                </div>

                <h2>
                    Something went wrong
                </h2>

                <p>
                    {error}
                </p>

                <button
                    onClick={loadOrders}
                >
                    Try Again
                </button>

            </div>
        );
    }


    // ==========================================
    // PAGE
    // ==========================================

    return (

        <div className="orders-page">


            {/* ======================================
                HEADER
            ====================================== */}

            <div className="orders-header">

                <div>

                    <span className="section-label">
                        ORDER HISTORY
                    </span>

                    <h1>
                        My Orders
                    </h1>

                    <p>
                        Track and manage your grocery orders.
                    </p>

                </div>


                {orders.length > 0 && (

                    <div className="orders-count">

                        {orders.length}

                        <span>
                            {orders.length === 1
                                ? " Order"
                                : " Orders"}
                        </span>

                    </div>

                )}

            </div>


            {/* ======================================
                EMPTY ORDERS
            ====================================== */}

            {orders.length === 0 ? (

                <div className="empty-orders">

                    <div className="empty-orders-icon">
                        📦
                    </div>

                    <h2>
                        No orders yet
                    </h2>

                    <p>
                        You haven't placed any orders.
                        Start shopping and your orders
                        will appear here.
                    </p>

                    <button
                        onClick={() =>
                            navigate("/products")
                        }
                    >
                        Start Shopping
                    </button>

                </div>

            ) : (

                /* ==================================
                   ORDERS LIST
                ================================== */

                <div className="orders-list">

                    {orders.map((order) => (

                        <div
                            className="order-card"
                            key={order.id}
                        >


                            {/* ==================================
                                ORDER TOP
                            ================================== */}

                            <div className="order-card-top">

                                <div className="order-number">

                                    <span className="order-icon">
                                        📦
                                    </span>

                                    <div>

                                        <span>
                                            ORDER
                                        </span>

                                        <h2>
                                            Order #{getOrderNumber(order)}
                                        </h2>

                                    </div>

                                </div>


                                <div className="order-date">

                                    <span>
                                        ORDERED ON
                                    </span>

                                    <strong>
                                        {formatDate(
                                            order.createdAt
                                        )}
                                    </strong>

                                </div>

                            </div>


                            {/* ==================================
                                ORDER INFORMATION
                            ================================== */}

                            <div className="order-card-body">


                                {/* TOTAL */}

                                <div className="order-info">

                                    <span>
                                        Total Amount
                                    </span>

                                    <strong>
                                        ₹
                                        {Number(
                                            order.totalAmount
                                        ).toFixed(2)}
                                    </strong>

                                </div>


                                {/* ORDER STATUS */}

                                <div className="order-info">

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


                                {/* PAYMENT STATUS */}

                                <div className="order-info">

                                    <span>
                                        Payment
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


                                {/* ADDRESS */}

                                <div className="order-info address-info">

                                    <span>
                                        Delivery Address
                                    </span>

                                    <strong>
                                        {order.shippingAddress ||
                                            "Address unavailable"}
                                    </strong>

                                </div>

                            </div>


                            {/* ==================================
                                ORDER FOOTER
                            ================================== */}

                            <div className="order-card-footer">

                                <button
                                    className="view-order-button"
                                    onClick={() =>
                                        navigate(
                                            `/orders/${order.id}`
                                        )
                                    }
                                >
                                    View Order

                                    <span>
                                        →
                                    </span>

                                </button>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}

export default Orders;