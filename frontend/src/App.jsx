import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Navbar from "./components/Navbar";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import OrderSuccess from "./pages/OrderSuccess";


function ProtectedRoute({ children }) {

    const token =
        localStorage.getItem("token");

    if (!token) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    return children;
}


function App() {

    return (

        <BrowserRouter>

            <Navbar />

            <Routes>

                {/* =========================
                    DEFAULT
                ========================= */}

                <Route
                    path="/"
                    element={
                        <Navigate
                            to="/products"
                            replace
                        />
                    }
                />


                {/* =========================
                    PUBLIC
                ========================= */}

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/products"
                    element={<Products />}
                />


                {/* =========================
                    PROTECTED
                ========================= */}

                <Route
                    path="/cart"
                    element={
                        <ProtectedRoute>
                            <Cart />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/checkout"
                    element={
                        <ProtectedRoute>
                            <Checkout />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/orders"
                    element={
                        <ProtectedRoute>
                            <Orders />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/orders/:orderId"
                    element={
                        <ProtectedRoute>
                            <OrderDetails />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/orders/success"
                    element={
                        <ProtectedRoute>
                            <OrderSuccess />
                        </ProtectedRoute>
                    }
                />


                {/* =========================
                    FALLBACK
                ========================= */}

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/products"
                            replace
                        />
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;