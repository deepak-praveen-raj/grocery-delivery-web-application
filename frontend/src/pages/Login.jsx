import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");

        if (!email.trim() || !password.trim()) {

            setError("Please enter your email and password.");

            return;
        }


        try {

            setLoading(true);

            const data = await loginUser({
                email: email.trim(),
                password
            });


            // Save JWT
            localStorage.setItem(
                "token",
                data.token
            );

            console.log(
                "Login successful"
            );


            // Redirect after login
            navigate("/products", {
                replace: true
            });

        } catch (error) {

            console.error(
                "Login failed:",
                error.response?.data ||
                error.message
            );


            const message =
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Invalid email or password.";

            setError(message);

        } finally {

            setLoading(false);
        }
    };


    return (

        <div className="auth-page">

            <div className="auth-card">


                {/* LOGO */}

                <div className="auth-logo">
                    🛒
                </div>


                <span className="auth-label">
                    GROCERY DELIVERY
                </span>


                <h1>
                    Welcome Back
                </h1>

                <p className="auth-subtitle">
                    Login to continue shopping.
                </p>


                {/* ERROR */}

                {error && (

                    <div className="auth-error">

                        <span>!</span>

                        <p>
                            {error}
                        </p>

                    </div>

                )}


                {/* FORM */}

                <form
                    className="auth-form"
                    onSubmit={handleSubmit}
                >


                    {/* EMAIL */}

                    <div className="auth-field">

                        <label>
                            Email Address
                        </label>

                        <input
                            type="email"
                            value={email}
                            placeholder="Enter your email"
                            onChange={(event) =>
                                setEmail(event.target.value)
                            }
                            disabled={loading}
                            autoComplete="email"
                            required
                        />

                    </div>


                    {/* PASSWORD */}

                    <div className="auth-field">

                        <label>
                            Password
                        </label>

                        <input
                            type="password"
                            value={password}
                            placeholder="Enter your password"
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            disabled={loading}
                            autoComplete="current-password"
                            required
                        />

                    </div>


                    {/* BUTTON */}

                    <button
                        type="submit"
                        className="auth-submit-button"
                        disabled={loading}
                    >

                        {loading
                            ? "Signing in..."
                            : "Login"}

                    </button>

                </form>


                {/* REGISTER */}

                <p className="auth-switch">

                    Don't have an account?

                    {" "}

                    <Link to="/register">
                        Create an account
                    </Link>

                </p>

            </div>

        </div>
    );
}

export default Login;