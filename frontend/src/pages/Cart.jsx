import { useEffect, useState } from "react";
import {
    getCart,
    updateCartItem,
    removeCartItem,
    clearCart
} from "../services/cartService";

import { Link, useNavigate } from "react-router-dom";

function Cart() {

    const [cart, setCart] = useState({
        cartId: null,
        items: [],
        totalAmount: 0
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [processingItem, setProcessingItem] = useState(null);
    const [clearing, setClearing] = useState(false);

    const navigate = useNavigate();


    const loadCart = async () => {

        try {

            setError("");

            const data = await getCart();

            setCart(data);

        } catch (error) {

            console.error(
                "Failed to load cart:",
                error.response?.data || error.message
            );

            setError("Failed to load cart.");

        } finally {

            setLoading(false);
        }
    };


    useEffect(() => {
        loadCart();
    }, []);


    const handleIncrease = async (item) => {

        try {

            setProcessingItem(item.id);

            const updatedCart =
                await updateCartItem(
                    item.id,
                    item.quantity + 1
                );

            setCart(updatedCart);

        } catch (error) {

            console.error(
                "Failed to increase quantity:",
                error.response?.data ||
                error.message
            );

            alert(
                error.response?.data?.message ||
                "Unable to increase quantity."
            );

        } finally {

            setProcessingItem(null);
        }
    };


    const handleDecrease = async (item) => {

        if (item.quantity <= 1) {
            return;
        }

        try {

            setProcessingItem(item.id);

            const updatedCart =
                await updateCartItem(
                    item.id,
                    item.quantity - 1
                );

            setCart(updatedCart);

        } catch (error) {

            console.error(
                "Failed to decrease quantity:",
                error.response?.data ||
                error.message
            );

            alert(
                error.response?.data?.message ||
                "Unable to decrease quantity."
            );

        } finally {

            setProcessingItem(null);
        }
    };


    const handleRemove = async (itemId) => {

        try {

            setProcessingItem(itemId);

            await removeCartItem(itemId);

            await loadCart();

        } catch (error) {

            console.error(
                "Failed to remove item:",
                error.response?.data ||
                error.message
            );

            alert(
                error.response?.data?.message ||
                "Unable to remove item."
            );

        } finally {

            setProcessingItem(null);
        }
    };


    const handleClearCart = async () => {

        if (cart.items.length === 0) {
            return;
        }

        const confirmed =
            window.confirm(
                "Are you sure you want to clear your cart?"
            );

        if (!confirmed) {
            return;
        }

        try {

            setClearing(true);

            await clearCart();

            await loadCart();

        } catch (error) {

            console.error(
                "Failed to clear cart:",
                error.response?.data ||
                error.message
            );

            alert(
                error.response?.data?.message ||
                "Unable to clear cart."
            );

        } finally {

            setClearing(false);
        }
    };


    if (loading) {

        return (
            <div className="cart-loading">

                <div className="loading-spinner"></div>

                <p>
                    Loading your cart...
                </p>

            </div>
        );
    }


    if (error) {

        return (
            <div className="cart-error">

                <h2>
                    Something went wrong
                </h2>

                <p>
                    {error}
                </p>

                <button
                    onClick={loadCart}
                >
                    Try Again
                </button>

            </div>
        );
    }


    return (
        <div className="cart-page">

            {/* ================================
                HEADER
            ================================= */}

            <div className="cart-header">

                <div>

                    <span className="section-label">
                        SHOPPING CART
                    </span>

                    <h1>
                        My Cart
                    </h1>

                    <p>
                        Review your items before checkout.
                    </p>

                </div>

                {cart.items.length > 0 && (

                    <button
                        className="clear-cart-button"
                        onClick={handleClearCart}
                        disabled={clearing}
                    >
                        {clearing
                            ? "Clearing..."
                            : "Clear Cart"}
                    </button>

                )}

            </div>


            {/* ================================
                EMPTY CART
            ================================= */}

            {cart.items.length === 0 ? (

                <div className="empty-cart">

                    <div className="empty-cart-icon">
                        🛒
                    </div>

                    <h2>
                        Your cart is empty
                    </h2>

                    <p>
                        Looks like you haven't added
                        anything to your cart yet.
                    </p>

                    <Link
                        to="/products"
                        className="continue-shopping-button"
                    >
                        Continue Shopping
                    </Link>

                </div>

            ) : (

                <div className="cart-layout">

                    {/* ================================
                        CART ITEMS
                    ================================= */}

                    <div className="cart-items-section">

                        <div className="cart-items-header">

                            <h2>
                                Your Items
                            </h2>

                            <span>
                                {cart.items.length}{" "}
                                {cart.items.length === 1
                                    ? "item"
                                    : "items"}
                            </span>

                        </div>


                        <div className="cart-items">

                            {cart.items.map((item) => (

                                <div
                                    className="cart-item"
                                    key={item.id}
                                >

                                    {/* PRODUCT IMAGE */}

                                    <Link
                                        to={`/products/${item.productId}`}
                                        className="cart-item-image"
                                    >

                                        {item.imageUrl ? (

                                            <img
                                                src={item.imageUrl}
                                                alt={item.productName}
                                            />

                                        ) : (

                                            <span>
                                                🛒
                                            </span>

                                        )}

                                    </Link>


                                    {/* PRODUCT INFO */}

                                    <div className="cart-item-info">

                                        <Link
                                            to={`/products/${item.productId}`}
                                            className="cart-item-name"
                                        >
                                            {item.productName}
                                        </Link>

                                        <p className="cart-item-price">
                                            ₹
                                            {Number(
                                                item.price
                                            ).toFixed(2)}
                                            {" "}per item
                                        </p>


                                        {/* QUANTITY */}

                                        <div className="cart-quantity">

                                            <button
                                                onClick={() =>
                                                    handleDecrease(item)
                                                }
                                                disabled={
                                                    item.quantity <= 1 ||
                                                    processingItem ===
                                                        item.id
                                                }
                                            >
                                                −
                                            </button>

                                            <span>
                                                {item.quantity}
                                            </span>

                                            <button
                                                onClick={() =>
                                                    handleIncrease(item)
                                                }
                                                disabled={
                                                    processingItem ===
                                                        item.id
                                                }
                                            >
                                                +
                                            </button>

                                        </div>

                                    </div>


                                    {/* SUBTOTAL + REMOVE */}

                                    <div className="cart-item-right">

                                        <strong>
                                            ₹
                                            {Number(
                                                item.subtotal
                                            ).toFixed(2)}
                                        </strong>

                                        <button
                                            className="remove-item-button"
                                            onClick={() =>
                                                handleRemove(item.id)
                                            }
                                            disabled={
                                                processingItem ===
                                                    item.id
                                            }
                                        >
                                            {processingItem === item.id
                                                ? "Removing..."
                                                : "Remove"}
                                        </button>

                                    </div>

                                </div>

                            ))}

                        </div>


                        <Link
                            to="/products"
                            className="continue-shopping-link"
                        >
                            ← Continue Shopping
                        </Link>

                    </div>


                    {/* ================================
                        ORDER SUMMARY
                    ================================= */}

                    <aside className="cart-summary">

                        <h2>
                            Order Summary
                        </h2>


                        <div className="summary-row">

                            <span>
                                Subtotal
                            </span>

                            <span>
                                ₹
                                {Number(
                                    cart.totalAmount
                                ).toFixed(2)}
                            </span>

                        </div>


                        <div className="summary-row">

                            <span>
                                Delivery
                            </span>

                            <span className="free-delivery">
                                FREE
                            </span>

                        </div>


                        <div className="summary-divider"></div>


                        <div className="summary-total">

                            <span>
                                Total
                            </span>

                            <strong>
                                ₹
                                {Number(
                                    cart.totalAmount
                                ).toFixed(2)}
                            </strong>

                        </div>


                        <button
                            className="checkout-button"
                            onClick={() =>
                                navigate("/checkout")
                            }
                        >
                            Proceed to Checkout
                        </button>


                        <div className="secure-checkout">

                            🔒 Secure checkout

                        </div>

                    </aside>

                </div>

            )}

        </div>
    );
}

export default Cart;