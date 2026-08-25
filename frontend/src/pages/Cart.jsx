import { useEffect, useState } from "react";
import {
    getCart,
    updateCartItem,
    removeCartItem,
    clearCart
} from "../services/cartService";

import { useNavigate } from "react-router-dom";

function Cart() {

    const [cart, setCart] = useState({
        cartId: null,
        items: [],
        totalAmount: 0
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const loadCart = async () => {

        try {

            const data = await getCart();

            setCart(data);

        } catch (error) {

            console.error(
                "Failed to load cart:",
                error.response?.data || error.message
            );

            setError("Failed to load cart");

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {
        loadCart();
    }, []);

    const handleIncrease = async (item) => {

        try {

            const updatedCart = await updateCartItem(
                item.id,
                item.quantity + 1
            );

            setCart(updatedCart);

        } catch (error) {

            console.error(
                "Failed to increase quantity:",
                error.response?.data || error.message
            );
        }
    };

    const handleDecrease = async (item) => {

        if (item.quantity <= 1) {
            return;
        }

        try {

            const updatedCart = await updateCartItem(
                item.id,
                item.quantity - 1
            );

            setCart(updatedCart);

        } catch (error) {

            console.error(
                "Failed to decrease quantity:",
                error.response?.data || error.message
            );
        }
    };

    const handleRemove = async (itemId) => {

        try {

            await removeCartItem(itemId);

            await loadCart();

        } catch (error) {

            console.error(
                "Failed to remove item:",
                error.response?.data || error.message
            );
        }
    };

    const handleClearCart = async () => {

        try {

            await clearCart();

            await loadCart();

        } catch (error) {

            console.error(
                "Failed to clear cart:",
                error.response?.data || error.message
            );
        }
    };

    if (loading) {
        return <h2>Loading cart...</h2>;
    }

    if (error) {
        return <h2>{error}</h2>;
    }

    return (
        <div>

            <h1>My Cart</h1>

            {cart.items.length === 0 ? (

                <p>Your cart is empty.</p>

            ) : (

                <>
                    {cart.items.map((item) => (

                        <div key={item.id}>

                            <h2>{item.productName}</h2>

                            {item.imageUrl && (
                                <img
                                    src={item.imageUrl}
                                    alt={item.productName}
                                    width="100"
                                />
                            )}

                            <p>
                                Price: ₹{item.price}
                            </p>

                            <p>
                                Subtotal: ₹{item.subtotal}
                            </p>

                            <div>

                                <button
                                    onClick={() =>
                                        handleDecrease(item)
                                    }
                                    disabled={item.quantity <= 1}
                                >
                                    -
                                </button>

                                <span>
                                    {" "}
                                    {item.quantity}{" "}
                                </span>

                                <button
                                    onClick={() =>
                                        handleIncrease(item)
                                    }
                                >
                                    +
                                </button>

                            </div>

                            <button
                                onClick={() =>
                                    handleRemove(item.id)
                                }
                            >
                                Remove
                            </button>

                            <hr />

                        </div>
                    ))}

                    <h2>
                        Total: ₹{cart.totalAmount}
                    </h2>

                    <button
                        onClick={handleClearCart}
                    >
                        Clear Cart
                    </button>

                    <button
                        onClick={() => navigate("/checkout")}
                    >
                        Checkout
                    </button>
                </>
            )}

        </div>
    );
}

export default Cart;