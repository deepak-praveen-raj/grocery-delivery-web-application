import axios from "axios";

const api = axios.create({

    baseURL: "http://localhost:8080",

    headers: {
        "Content-Type": "application/json"
    }

});


// =====================================================
// REQUEST INTERCEPTOR
// =====================================================

api.interceptors.request.use(

    (config) => {

        const isAuthRequest =
            config.url === "/api/auth/login" ||
            config.url === "/api/auth/register";


        if (!isAuthRequest) {

            const token =
                localStorage.getItem("token");


            if (token) {

                config.headers.Authorization =
                    `Bearer ${token}`;

            }

        }


        return config;

    },

    (error) => {

        return Promise.reject(error);

    }

);


// =====================================================
// RESPONSE INTERCEPTOR
// =====================================================

api.interceptors.response.use(

    (response) => {

        return response;

    },

    (error) => {

        if (error.response?.status === 401) {

            console.log(
                "Authentication expired. Logging out."
            );


            localStorage.removeItem("token");


            // Avoid redirecting when the user is
            // already on login/register

            const currentPath =
                window.location.pathname;


            if (
                currentPath !== "/login" &&
                currentPath !== "/register"
            ) {

                window.location.href = "/login";

            }

        }


        return Promise.reject(error);

    }

);


export default api;