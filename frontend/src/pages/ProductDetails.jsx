import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getProductById } from "../services/productService";
import { addToCart } from "../services/cartService";

function ProductDetails() {

    const { productId } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);

    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {

        const loadProduct = async () => {

            try {

                setLoading(true);
                setError("");

                const data =
                    await getProductById(productId);

                setProduct(data);

            } catch (error) {

                console.error(
                    "Failed to load product:",
                    error.response?.data ||
                    error.message
                );

                setError(
                    "Unable to load product."
                );

            } finally {

                setLoading(false);
            }
        };

        loadProduct();

    }, [productId]);


    const increaseQuantity = () => {

        if (
            product &&
            quantity < product.stockQuantity
        ) {
            setQuantity(quantity + 1);
        }
    };


    const decreaseQuantity = () => {

        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };


    const handleAddToCart = async () => {

        try {

            setAdding(true);

            await addToCart(
                product.id,
                quantity
            );

            alert(
                "Product added to cart successfully!"
            );

        } catch (error) {

            console.error(
                "Failed to add product:",
                error.response?.data ||
                error.message
            );

            alert(
                error.response?.data?.message ||
                "Failed to add product to cart."
            );

        } finally {

            setAdding(false);
        }
    };


    if (loading) {

        return (
            <div className="product-details-loading">

                <div className="loading-spinner"></div>

                <p>
                    Loading product...
                </p>

            </div>
        );
    }


    if (error || !product) {

        return (
            <div className="product-details-error">

                <h2>
                    Product not found
                </h2>

                <p>
                    {error ||
                        "The requested product could not be found."}
                </p>

                <Link
                    to="/products"
                    className="back-products-button"
                >
                    Back to Products
                </Link>

            </div>
        );
    }


    const isOutOfStock =
        !product.active ||
        product.stockQuantity <= 0;


    return (
        <div className="product-details-page">

            {/* Breadcrumb */}

            <div className="product-breadcrumb">

                <Link to="/products">
                    Products
                </Link>

                <span>
                    /
                </span>

                <span>
                    {product.name}
                </span>

            </div>


            {/* Product Details */}

            <div className="product-details-container">

                {/* Image */}

                <div className="product-details-image">

                    {product.imageUrl ? (

                        <img
                            src={product.imageUrl}
                            alt={product.name}
                        />

                    ) : (

                        <span>
                            🛒
                        </span>

                    )}

                </div>


                {/* Information */}

                <div className="product-details-info">

                    <span className="product-details-label">
                        FRESH PRODUCT
                    </span>

                    <h1>
                        {product.name}
                    </h1>

                    <p className="product-details-description">
                        {product.description ||
                            "Fresh and high-quality product for your everyday needs."}
                    </p>


                    <div className="product-details-price">
                        ₹{Number(product.price).toFixed(2)}
                    </div>


                    {/* Stock */}

                    <div className="product-stock">

                        {isOutOfStock ? (

                            <span className="out-of-stock">
                                Out of Stock
                            </span>

                        ) : (

                            <span className="in-stock">
                                ✓ In Stock
                            </span>

                        )}

                        {!isOutOfStock && (
                            <span>
                                {product.stockQuantity} available
                            </span>
                        )}

                    </div>


                    {/* Quantity */}

                    {!isOutOfStock && (

                        <div className="quantity-section">

                            <span>
                                Quantity
                            </span>

                            <div className="quantity-control">

                                <button
                                    onClick={decreaseQuantity}
                                    disabled={quantity <= 1}
                                >
                                    −
                                </button>

                                <span>
                                    {quantity}
                                </span>

                                <button
                                    onClick={increaseQuantity}
                                    disabled={
                                        quantity >=
                                        product.stockQuantity
                                    }
                                >
                                    +
                                </button>

                            </div>

                        </div>

                    )}


                    {/* Actions */}

                    <div className="product-details-actions">

                        {!isOutOfStock && (

                            <button
                                className="details-add-cart"
                                onClick={handleAddToCart}
                                disabled={adding}
                            >

                                {adding
                                    ? "Adding..."
                                    : `Add ${quantity} to Cart`}

                            </button>

                        )}

                        <button
                            className="details-view-cart"
                            onClick={() =>
                                navigate("/cart")
                            }
                        >
                            View Cart
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default ProductDetails;