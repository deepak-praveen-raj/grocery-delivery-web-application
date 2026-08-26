import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080",
    headers: {
        "Content-Type": "application/json"
    }
});

api.interceptors.request.use(
    (config) => {

        const isAuthRequest =
            config.url === "/api/auth/login" ||
            config.url === "/api/auth/register";

        if (!isAuthRequest) {

            const token =
                localStorage.getItem("token");

            console.log(
                "Request:",
                config.url
            );

            console.log(
                "Token exists:",
                !!token
            );

            if (token) {

                config.headers.Authorization =
                    `Bearer ${token}`;

                console.log(
                    "Authorization header attached"
                );
            }
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;