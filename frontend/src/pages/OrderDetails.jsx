import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getOrderById } from "../services/orderService";

function OrderDetails() {

    const { orderId } = useParams();

    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const loadOrder = async () => {

            try {

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
                    "Failed to load order"
                );

            } finally {

                setLoading(false);
            }
        };

        loadOrder();

    }, [orderId]);


    if (loading) {
        return <h2>Loading order...</h2>;
    }


    if (error) {
        return (
            <div>

                <p>{error}</p>

                <button
                    onClick={() =>
                        navigate("/orders")
                    }
                >
                    Back to Orders
                </button>

            </div>
        );
    }


    if (!order) {
        return <p>Order not found.</p>;
    }


    return (

        <div>

            <button
                onClick={() =>
                    navigate("/orders")
                }
            >
                ← Back to Orders
            </button>


            <h1>
                Order #{order.id}
            </h1>


            <div>

                <h2>Order Information</h2>

                <p>
                    Order Status:{" "}
                    <strong>
                        {order.status}
                    </strong>
                </p>

                <p>
                    Payment Status:{" "}
                    <strong>
                        {order.paymentStatus}
                    </strong>
                </p>

                <p>
                    Total Amount:{" "}
                    <strong>
                        ₹{order.totalAmount}
                    </strong>
                </p>

                <p>
                    Shipping Address:
                </p>

                <p>
                    {order.shippingAddress}
                </p>

                <p>
                    Created At:{" "}
                    {new Date(
                        order.createdAt
                    ).toLocaleString()}
                </p>

            </div>


            <hr />


            <h2>Order Items</h2>


            {order.items &&
            order.items.length > 0 ? (

                order.items.map((item) => (

                    <div
                        key={item.id}
                        style={{
                            border: "1px solid #ddd",
                            padding: "15px",
                            marginBottom: "10px"
                        }}
                    >

                        <h3>
                            {item.productName}
                        </h3>

                        <p>
                            Quantity:{" "}
                            {item.quantity}
                        </p>

                        <p>
                            Unit Price: ₹
                            {item.unitPrice}
                        </p>

                        <p>
                            Subtotal: ₹
                            {item.subtotal}
                        </p>

                    </div>

                ))

            ) : (

                <p>
                    No items found.
                </p>

            )}


            <hr />


            <h2>
                Total: ₹{order.totalAmount}
            </h2>

        </div>
    );
}

export default OrderDetails;