import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar() {

    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
    }, []);

    const handleLogout = () => {

        localStorage.removeItem("token");

        setIsLoggedIn(false);

        navigate("/login");
    };

    return (
        <nav className="navbar">

            {/* Logo */}
            <Link to="/products" className="navbar-logo">
                🛒 GroceryGo
            </Link>

            {/* Navigation */}
            <div className="navbar-links">

                <Link to="/products">
                    Products
                </Link>

                <Link to="/cart">
                    Cart
                </Link>

                <Link to="/orders">
                    Orders
                </Link>

            </div>

            {/* User Actions */}
            <div className="navbar-actions">

                {isLoggedIn ? (

                    <button
                        className="logout-button"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                ) : (

                    <>
                        <Link
                            to="/login"
                            className="login-link"
                        >
                            Login
                        </Link>

                        <Link
                            to="/register"
                            className="register-button"
                        >
                            Register
                        </Link>
                    </>

                )}

            </div>

        </nav>
    );
}

export default Navbar;