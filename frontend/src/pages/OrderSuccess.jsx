import { useNavigate, useLocation } from "react-router-dom";

function OrderSuccess() {

    const navigate = useNavigate();
    const location = useLocation();

    const orderId = location.state?.orderId;

    return (
        <div>

            <h1>🎉 Order Placed Successfully!</h1>

            <p>
                Thank you for your purchase.
            </p>

            {orderId && (
                <h2>
                    Order #{orderId}
                </h2>
            )}

            <p>
                Your payment has been successfully
                verified.
            </p>

            <div>

                <button
                    onClick={() =>
                        navigate("/orders")
                    }
                >
                    View My Orders
                </button>

                <button
                    onClick={() =>
                        navigate("/products")
                    }
                >
                    Continue Shopping
                </button>

            </div>

        </div>
    );
}

export default OrderSuccess;