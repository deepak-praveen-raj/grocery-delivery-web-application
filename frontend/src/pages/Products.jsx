import { useEffect, useState } from "react";

import {
    filterProducts
} from "../services/productService";

import {
    getAllCategories
} from "../services/categoryService";

import {
    addToCart
} from "../services/cartService";

import {
    Link
} from "react-router-dom";


function Products() {

    // ==========================================
    // PRODUCTS
    // ==========================================

    const [products, setProducts] = useState([]);

    const [categories, setCategories] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [addingProduct, setAddingProduct] = useState(null);


    // ==========================================
    // FILTERS
    // ==========================================

    const [keyword, setKeyword] = useState("");

    const [categoryId, setCategoryId] = useState("");

    const [minPrice, setMinPrice] = useState("");

    const [maxPrice, setMaxPrice] = useState("");


    // ==========================================
    // SORTING
    // ==========================================

    const [sortBy, setSortBy] = useState("name");

    const [direction, setDirection] = useState("asc");


    // ==========================================
    // PAGINATION
    // ==========================================

    const [page, setPage] = useState(0);

    const [totalPages, setTotalPages] = useState(0);

    const [totalElements, setTotalElements] = useState(0);

    const pageSize = 8;


    // ==========================================
    // LOAD PRODUCTS
    // ==========================================

    const loadProducts = async (filterValues = {}) => {

        try {

            setLoading(true);

            setError("");


            const data = await filterProducts({

                keyword:
                    filterValues.keyword ??
                    keyword,

                categoryId:
                    filterValues.categoryId ??
                    categoryId,

                minPrice:
                    filterValues.minPrice ??
                    minPrice,

                maxPrice:
                    filterValues.maxPrice ??
                    maxPrice,

                page:
                    filterValues.page ??
                    page,

                size: pageSize,

                sortBy:
                    filterValues.sortBy ??
                    sortBy,

                direction:
                    filterValues.direction ??
                    direction

            });


            setProducts(
                data.content || []
            );

            setTotalPages(
                data.totalPages || 0
            );

            setTotalElements(
                data.totalElements || 0
            );

        } catch (error) {

            console.error(
                "Failed to load products:",
                error.response?.data ||
                error.message
            );

            setError(
                error.response?.data?.message ||
                "Failed to load products."
            );

        } finally {

            setLoading(false);
        }
    };


    // ==========================================
    // LOAD CATEGORIES
    // ==========================================

    const loadCategories = async () => {

        try {

            const data =
                await getAllCategories();

            setCategories(data || []);

        } catch (error) {

            console.error(
                "Failed to load categories:",
                error.response?.data ||
                error.message
            );

        }
    };


    // ==========================================
    // INITIAL LOAD
    // ==========================================

    useEffect(() => {

        loadCategories();

        loadProducts();

    }, []);


    // ==========================================
    // SEARCH
    // ==========================================

    const handleSearch = (event) => {

        event.preventDefault();

        setPage(0);

        loadProducts({
            keyword,
            page: 0
        });
    };


    // ==========================================
    // APPLY FILTERS
    // ==========================================

    const handleApplyFilters = () => {

        setPage(0);

        loadProducts({

            keyword,

            categoryId,

            minPrice,

            maxPrice,

            page: 0

        });
    };


    // ==========================================
    // CLEAR FILTERS
    // ==========================================

    const handleClearFilters = () => {

        setKeyword("");

        setCategoryId("");

        setMinPrice("");

        setMaxPrice("");

        setSortBy("name");

        setDirection("asc");

        setPage(0);


        loadProducts({

            keyword: "",

            categoryId: "",

            minPrice: "",

            maxPrice: "",

            page: 0,

            sortBy: "name",

            direction: "asc"

        });
    };


    // ==========================================
    // CATEGORY CHANGE
    // ==========================================

    const handleCategoryChange = (event) => {

        const value =
            event.target.value;

        setCategoryId(value);

        setPage(0);

        loadProducts({

            categoryId: value,

            page: 0

        });
    };


    // ==========================================
    // SORT CHANGE
    // ==========================================

    const handleSortChange = (event) => {

        const value =
            event.target.value;

        setSortBy(value);

        setPage(0);

        loadProducts({

            sortBy: value,

            page: 0

        });
    };


    // ==========================================
    // DIRECTION CHANGE
    // ==========================================

    const handleDirectionChange = (event) => {

        const value =
            event.target.value;

        setDirection(value);

        setPage(0);

        loadProducts({

            direction: value,

            page: 0

        });
    };


    // ==========================================
    // PREVIOUS PAGE
    // ==========================================

    const handlePreviousPage = () => {

        if (page <= 0) {
            return;
        }

        const newPage = page - 1;

        setPage(newPage);

        loadProducts({
            page: newPage
        });
    };


    // ==========================================
    // NEXT PAGE
    // ==========================================

    const handleNextPage = () => {

        if (page >= totalPages - 1) {
            return;
        }

        const newPage = page + 1;

        setPage(newPage);

        loadProducts({
            page: newPage
        });
    };


    // ==========================================
    // ADD TO CART
    // ==========================================

    const handleAddToCart = async (productId) => {

        try {

            setAddingProduct(productId);

            await addToCart(
                productId,
                1
            );

            // alert(
            //     "Product added to cart successfully!"
            // );

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

            setAddingProduct(null);
        }
    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading && products.length === 0) {

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


    // ==========================================
    // ERROR
    // ==========================================

    if (error && products.length === 0) {

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
                            loadProducts()
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


            {/* =====================================
                HERO SECTION
            ====================================== */}

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
                        Shop fresh products and everyday
                        essentials from the comfort of your home.
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


            {/* =====================================
                PRODUCTS SECTION
            ====================================== */}

            <section
                className="products-section"
                id="products"
            >


                {/* =================================
                    SECTION HEADER
                ================================== */}

                <div className="section-heading">

                    <div>

                        <span className="section-label">
                            OUR STORE
                        </span>

                        <h2>
                            Fresh Products
                        </h2>

                        <p>
                            Everything you need for your
                            everyday shopping.
                        </p>

                    </div>


                    <span className="product-count">

                        {totalElements} Products

                    </span>

                </div>


                {/* =================================
                    SEARCH
                ================================== */}

                <form
                    className="product-search-bar"
                    onSubmit={handleSearch}
                >

                    <div className="search-input-wrapper">

                        <span className="search-icon">
                            🔎
                        </span>

                        <input
                            type="text"
                            placeholder="Search products..."
                            value={keyword}
                            onChange={(event) =>
                                setKeyword(
                                    event.target.value
                                )
                            }
                        />

                    </div>


                    <button
                        type="submit"
                        className="search-button"
                    >
                        Search
                    </button>

                </form>


                {/* =================================
                    FILTERS
                ================================== */}

                <div className="product-filters">


                    {/* CATEGORY */}

                    <div className="filter-group">

                        <label>
                            Category
                        </label>

                        <select
                            value={categoryId}
                            onChange={
                                handleCategoryChange
                            }
                        >

                            <option value="">
                                All Categories
                            </option>


                            {categories.map(
                                (category) => (

                                    <option
                                        key={category.id}
                                        value={category.id}
                                    >
                                        {category.name}
                                    </option>

                                )
                            )}

                        </select>

                    </div>


                    {/* MIN PRICE */}

                    <div className="filter-group">

                        <label>
                            Min Price
                        </label>

                        <input
                            type="number"
                            min="0"
                            placeholder="₹0"
                            value={minPrice}
                            onChange={(event) =>
                                setMinPrice(
                                    event.target.value
                                )
                            }
                        />

                    </div>


                    {/* MAX PRICE */}

                    <div className="filter-group">

                        <label>
                            Max Price
                        </label>

                        <input
                            type="number"
                            min="0"
                            placeholder="₹10,000"
                            value={maxPrice}
                            onChange={(event) =>
                                setMaxPrice(
                                    event.target.value
                                )
                            }
                        />

                    </div>


                    {/* APPLY */}

                    <button
                        type="button"
                        className="apply-filter-button"
                        onClick={
                            handleApplyFilters
                        }
                    >
                        Apply Filters
                    </button>


                    {/* CLEAR */}

                    <button
                        type="button"
                        className="clear-filter-button"
                        onClick={
                            handleClearFilters
                        }
                    >
                        Clear
                    </button>

                </div>


                {/* =================================
                    TOOLBAR
                ================================== */}

                <div className="products-toolbar">

                    <span>

                        {totalElements} products found

                    </span>


                    <div className="sort-controls">

                        <label>
                            Sort by
                        </label>


                        <select
                            value={sortBy}
                            onChange={
                                handleSortChange
                            }
                        >

                            <option value="name">
                                Name
                            </option>

                            <option value="price">
                                Price
                            </option>

                        </select>


                        <select
                            value={direction}
                            onChange={
                                handleDirectionChange
                            }
                        >

                            <option value="asc">
                                Ascending
                            </option>

                            <option value="desc">
                                Descending
                            </option>

                        </select>

                    </div>

                </div>


                {/* =================================
                    PRODUCTS GRID
                ================================== */}

                {products.length === 0 ? (

                    <div className="empty-products">

                        <div className="empty-icon">
                            🔎
                        </div>

                        <h2>
                            No products found
                        </h2>

                        <p>
                            Try changing your search
                            or filters.
                        </p>

                        <button
                            onClick={
                                handleClearFilters
                            }
                        >
                            Clear Filters
                        </button>

                    </div>

                ) : (

                    <div className="products-grid">

                        {products.map((product) => (

                            <div
                                className="product-card"
                                key={product.id}
                            >


                                {/* PRODUCT IMAGE */}

                                <Link
                                    to={`/products/${product.id}`}
                                    className="product-image-link"
                                >

                                    <div className="product-image">

                                        {product.imageUrl ? (

                                            <img
                                                src={
                                                    product.imageUrl
                                                }
                                                alt={
                                                    product.name
                                                }
                                            />

                                        ) : (

                                            <span>
                                                🛒
                                            </span>

                                        )}

                                    </div>

                                </Link>


                                {/* PRODUCT INFORMATION */}

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


                {/* =================================
                    PAGINATION
                ================================== */}

                {totalPages > 1 && (

                    <div className="products-pagination">

                        <button
                            disabled={page === 0}
                            onClick={
                                handlePreviousPage
                            }
                        >
                            ← Previous
                        </button>


                        <span>

                            Page{" "}

                            <strong>
                                {page + 1}
                            </strong>

                            {" "}of{" "}

                            <strong>
                                {totalPages}
                            </strong>

                        </span>


                        <button
                            disabled={
                                page >=
                                totalPages - 1
                            }
                            onClick={
                                handleNextPage
                            }
                        >
                            Next →
                        </button>

                    </div>

                )}

            </section>

        </div>
    );
}

export default Products;