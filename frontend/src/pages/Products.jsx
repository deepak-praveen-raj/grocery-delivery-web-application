import { useEffect, useState } from "react";
import { getProducts } from "../services/productService";
import { addToCart } from "../services/cartService";
import { Link } from "react-router-dom";

function Products() {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [addingProduct, setAddingProduct] = useState(null);

    useEffect(() => {

        const loadProducts = async () => {

            try {

                const data = await getProducts();

                setProducts(data.content || []);

            } catch (error) {

                console.error(
                    "Failed to load products:",
                    error.response?.data || error.message
                );

                setError("Failed to load products.");

            } finally {

                setLoading(false);
            }
        };

        loadProducts();

    }, []);


    const handleAddToCart = async (productId) => {

        try {

            setAddingProduct(productId);

            await addToCart(productId, 1);

            alert("Product added to cart successfully!");

        } catch (error) {

            console.error(
                "Failed to add product:",
                error.response?.data || error.message
            );

            alert(
                error.response?.data?.message ||
                "Failed to add product to cart."
            );

        } finally {

            setAddingProduct(null);
        }
    };


    if (loading) {

        return (
            <div className="products-page">

                <div className="products-loading">

                    <div className="loading-spinner"></div>

                    <p>
                        Loading fresh products...
                    </p>

                </div>

            </div>
        );
    }


    if (error) {

        return (
            <div className="products-page">

                <div className="products-error">

                    <h2>
                        Something went wrong
                    </h2>

                    <p>
                        {error}
                    </p>

                    <button
                        onClick={() =>
                            window.location.reload()
                        }
                    >
                        Try Again
                    </button>

                </div>

            </div>
        );
    }


    return (
        <div className="products-page">

            {/* ================================
                HERO SECTION
            ================================= */}

            <section className="products-hero">

                <div className="hero-content">

                    <span className="hero-badge">
                        Fresh &nbsp; • &nbsp; Fast &nbsp; • &nbsp; Reliable
                    </span>

                    <h1>
                        Fresh groceries,
                        <br />
                        delivered to your door.
                    </h1>

                    <p>
                        Shop fresh products and everyday essentials
                        from the comfort of your home.
                    </p>

                    <div className="hero-actions">

                        <a
                            href="#products"
                            className="hero-button"
                        >
                            Shop Now
                        </a>

                        <Link
                            to="/cart"
                            className="hero-cart-button"
                        >
                            View Cart
                        </Link>

                    </div>

                </div>


                <div className="hero-visual">

                    <div className="hero-circle">
                        🛒
                    </div>

                </div>

            </section>


            {/* ================================
                PRODUCTS SECTION
            ================================= */}

            <section
                className="products-section"
                id="products"
            >

                <div className="section-heading">

                    <div>

                        <span className="section-label">
                            OUR STORE
                        </span>

                        <h2>
                            Fresh Products
                        </h2>

                        <p>
                            Everything you need for your everyday shopping.
                        </p>

                    </div>


                    <span className="product-count">
                        {products.length} Products
                    </span>

                </div>


                {products.length === 0 ? (

                    <div className="empty-products">

                        <div className="empty-icon">
                            🛒
                        </div>

                        <h2>
                            No products available
                        </h2>

                        <p>
                            Please check back later.
                        </p>

                    </div>

                ) : (

                    <div className="products-grid">

                        {products.map((product) => (

                            <div
                                className="product-card"
                                key={product.id}
                            >

                                {/* ================================
                                    PRODUCT IMAGE
                                ================================= */}

                                <Link
                                    to={`/products/${product.id}`}
                                    className="product-image-link"
                                >

                                    <div className="product-image">

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

                                </Link>


                                {/* ================================
                                    PRODUCT INFORMATION
                                ================================= */}

                                <div className="product-info">

                                    <Link
                                        to={`/products/${product.id}`}
                                        className="product-name-link"
                                    >

                                        <h3>
                                            {product.name}
                                        </h3>

                                    </Link>


                                    <p className="product-description">

                                        {product.description ||
                                            "Fresh and high-quality product."}

                                    </p>


                                    <div className="product-bottom">

                                        <div className="product-price">

                                            ₹
                                            {Number(
                                                product.price
                                            ).toFixed(2)}

                                        </div>


                                        <button
                                            className="add-cart-button"
                                            disabled={
                                                addingProduct ===
                                                product.id
                                            }
                                            onClick={() =>
                                                handleAddToCart(
                                                    product.id
                                                )
                                            }
                                        >

                                            {addingProduct ===
                                            product.id
                                                ? "Adding..."
                                                : "+ Add"}

                                        </button>

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </section>

        </div>
    );
}

export default Products;