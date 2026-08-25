import { useEffect, useState } from "react";
import { getProducts } from "../services/productService";
import { addToCart } from "../services/cartService";

function Products() {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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

                setError("Failed to load products");

            } finally {

                setLoading(false);
            }
        };

        loadProducts();

    }, []);

    const handleAddToCart = async (productId) => {

    try {

        const cart = await addToCart(productId, 1);

        console.log("Product added to cart:", cart);

        alert("Product added to cart");

    } catch (error) {

        console.error(
            "Failed to add product:",
            error.response?.data || error.message
        );

        alert("Failed to add product to cart");
    }
};

    if (loading) {
        return <h2>Loading products...</h2>;
    }

    if (error) {
        return <h2>{error}</h2>;
    }

    return (
        <div>

            <h1>Grocery Store</h1>

            {products.length === 0 ? (

                <p>No products available.</p>

            ) : (

                <div>

                    {products.map((product) => (

                        <div key={product.id}>

                            <h2>{product.name}</h2>

                            <p>{product.description}</p>

                            <p>₹{product.price}</p>

                            <button onClick={() => handleAddToCart(product.id)}>
                                Add to Cart
                            </button>

                            <hr />

                        </div>

                    ))}

                </div>
            )}

        </div>
    );
}

export default Products;