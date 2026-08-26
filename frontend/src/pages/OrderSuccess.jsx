import { useNavigate, useLocation } from "react-router-dom";

function OrderSuccess() {

    const navigate = useNavigate();
    const location = useLocation();

    const orderId = location.state?.orderId;


    return (

        <div className="order-success-page">

            <div className="order-success-card">

                {/* SUCCESS ICON */}

                <div className="success-icon">
                    ✓
                </div>


                {/* SUCCESS MESSAGE */}

                <span className="success-label">
                    PAYMENT CONFIRMED
                </span>

                <h1>
                    Order Placed Successfully!
                </h1>

                <p className="success-message">
                    Thank you for your purchase.
                    Your payment has been successfully
                    verified and your order is being processed.
                </p>


                {/* ORDER ID */}

                {orderId && (

                    <div className="success-order-number">

                        <span>
                            ORDER NUMBER
                        </span>

                        <strong>
                            #{orderId}
                        </strong>

                    </div>

                )}


                {/* PAYMENT CONFIRMED */}

                <div className="payment-confirmed-box">

                    <div className="payment-confirmed-icon">
                        ✓
                    </div>

                    <div>

                        <strong>
                            Payment Successful
                        </strong>

                        <p>
                            Your payment has been securely
                            verified through Razorpay.
                        </p>

                    </div>

                </div>


                {/* ACTIONS */}

                <div className="success-actions">

                    <button
                        className="success-primary-button"
                        onClick={() =>
                            navigate("/orders")
                        }
                    >
                        View My Orders
                        <span>→</span>
                    </button>


                    <button
                        className="success-secondary-button"
                        onClick={() =>
                            navigate("/products")
                        }
                    >
                        Continue Shopping
                    </button>

                </div>


                {/* FOOTER */}

                <p className="success-footer">
                    🔒 Your transaction was processed securely.
                </p>

            </div>

        </div>
    );
}

export default OrderSuccess;