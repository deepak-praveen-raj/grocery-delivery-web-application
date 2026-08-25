import { useState } from "react";
import { loginUser } from "../services/authService";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (event) => {

        event.preventDefault();

        try {

            const data = await loginUser({
                email,
                password
            });

            console.log("Login successful:", data);

            localStorage.setItem("token", data.token);

        } catch (error) {

            console.error(
                "Login failed:",
                error.response?.data || error.message
            );
        }
    };

    return (
        <div>
            <h1>Login</h1>

            <form onSubmit={handleSubmit}>

                <div>
                    <label>Email</label>

                    <input
                        type="email"
                        value={email}
                        onChange={(event) =>
                            setEmail(event.target.value)
                        }
                        required
                    />
                </div>

                <div>
                    <label>Password</label>

                    <input
                        type="password"
                        value={password}
                        onChange={(event) =>
                            setPassword(event.target.value)
                        }
                        required
                    />
                </div>

                <button type="submit">
                    Login
                </button>

            </form>
        </div>
    );
}

export default Login;