import { Link, useNavigate } from "react-router-dom";

function Navbar() {

    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    const handleLogout = () => {

        localStorage.removeItem("token");

        navigate("/login");
    };


    return (
        <header className="navbar">

            <div className="navbar-container">

                {/* LOGO */}

                <Link
                    to="/products"
                    className="navbar-logo"
                >
                    🛒 Grocery Store
                </Link>


                {/* NAVIGATION */}

                <nav className="navbar-links">

                    <Link to="/products">
                        Products
                    </Link>

                    {token && (
                        <>
                            <Link to="/cart">
                                Cart
                            </Link>

                            <Link to="/orders">
                                Orders
                            </Link>
                        </>
                    )}

                </nav>


                {/* USER ACTIONS */}

                <div className="navbar-actions">

                    {token ? (

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
                                className="navbar-login"
                            >
                                Login
                            </Link>

                            <Link
                                to="/register"
                                className="navbar-register"
                            >
                                Register
                            </Link>
                        </>

                    )}

                </div>

            </div>

        </header>
    );
}

export default Navbar;