import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";

function Register() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phone: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));

    };


    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setSuccess("");


        // Basic validation

        if (
            !formData.firstName.trim() ||
            !formData.lastName.trim() ||
            !formData.email.trim() ||
            !formData.password.trim() ||
            !formData.phone.trim()
        ) {

            setError(
                "Please fill in all fields."
            );

            return;
        }


        if (formData.password.length < 6) {

            setError(
                "Password must be at least 6 characters."
            );

            return;
        }


        try {

            setLoading(true);

            const data = await registerUser({
                ...formData,

                firstName:
                    formData.firstName.trim(),

                lastName:
                    formData.lastName.trim(),

                email:
                    formData.email.trim(),

                phone:
                    formData.phone.trim()
            });


            console.log(
                "Registration successful:",
                data
            );


            setSuccess(
                "Registration successful! Redirecting to login..."
            );


            // Give the user a moment to see success
            setTimeout(() => {

                navigate("/login", {
                    replace: true
                });

            }, 1200);


        } catch (error) {

            console.error(
                "Registration failed:",
                error.response?.data ||
                error.message
            );


            const message =
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Registration failed. Please try again.";

            setError(message);

        } finally {

            setLoading(false);
        }
    };


    return (

        <div className="auth-page">

            <div className="auth-card register-card">


                {/* LOGO */}

                <div className="auth-logo">
                    🛒
                </div>


                <span className="auth-label">
                    GROCERY DELIVERY
                </span>


                <h1>
                    Create Account
                </h1>

                <p className="auth-subtitle">
                    Create your account and start shopping.
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


                {/* SUCCESS */}

                {success && (

                    <div className="auth-success">

                        <span>✓</span>

                        <p>
                            {success}
                        </p>

                    </div>

                )}


                {/* FORM */}

                <form
                    className="auth-form"
                    onSubmit={handleSubmit}
                >


                    {/* FIRST + LAST NAME */}

                    <div className="auth-row">

                        <div className="auth-field">

                            <label>
                                First Name
                            </label>

                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                placeholder="First name"
                                onChange={handleChange}
                                disabled={loading}
                                autoComplete="given-name"
                                required
                            />

                        </div>


                        <div className="auth-field">

                            <label>
                                Last Name
                            </label>

                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                placeholder="Last name"
                                onChange={handleChange}
                                disabled={loading}
                                autoComplete="family-name"
                                required
                            />

                        </div>

                    </div>


                    {/* EMAIL */}

                    <div className="auth-field">

                        <label>
                            Email Address
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            placeholder="Enter your email"
                            onChange={handleChange}
                            disabled={loading}
                            autoComplete="email"
                            required
                        />

                    </div>


                    {/* PHONE */}

                    <div className="auth-field">

                        <label>
                            Phone Number
                        </label>

                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            placeholder="Enter your phone number"
                            onChange={handleChange}
                            disabled={loading}
                            autoComplete="tel"
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
                            name="password"
                            value={formData.password}
                            placeholder="Create a password"
                            onChange={handleChange}
                            disabled={loading}
                            autoComplete="new-password"
                            required
                        />

                        <small>
                            Minimum 6 characters
                        </small>

                    </div>


                    {/* BUTTON */}

                    <button
                        type="submit"
                        className="auth-submit-button"
                        disabled={loading}
                    >

                        {loading
                            ? "Creating Account..."
                            : "Create Account"}

                    </button>

                </form>


                {/* LOGIN */}

                <p className="auth-switch">

                    Already have an account?

                    {" "}

                    <Link to="/login">
                        Login
                    </Link>

                </p>

            </div>

        </div>
    );
}

export default Register;