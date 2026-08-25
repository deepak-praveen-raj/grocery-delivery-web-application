import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyOrders } from "../services/orderService";

function Orders() {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    useEffect(() => {

        const loadOrders = async () => {

            try {

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
                    "Failed to load orders"
                );

            } finally {

                setLoading(false);
            }
        };

        loadOrders();

    }, []);


    if (loading) {
        return <h2>Loading orders...</h2>;
    }


    if (error) {
        return <p>{error}</p>;
    }


    return (
        <div>

            <h1>My Orders</h1>

            {orders.length === 0 ? (

                <p>
                    You don't have any orders yet.
                </p>

            ) : (

                orders.map((order) => (

                    <div
                        key={order.id}
                        style={{
                            border: "1px solid #ddd",
                            padding: "20px",
                            marginBottom: "15px"
                        }}
                    >

                        <h2>
                            Order #{order.id}
                        </h2>

                        <p>
                            Total: ₹{order.totalAmount}
                        </p>

                        <p>
                            Order Status:{" "}
                            {order.status}
                        </p>

                        <p>
                            Payment Status:{" "}
                            {order.paymentStatus}
                        </p>

                        <p>
                            Shipping Address:{" "}
                            {order.shippingAddress}
                        </p>

                        <button
                            onClick={() =>
                                navigate(
                                    `/orders/${order.id}`
                                )
                            }
                        >
                            View Order
                        </button>

                    </div>

                ))

            )}

        </div>
    );
}

export default Orders;