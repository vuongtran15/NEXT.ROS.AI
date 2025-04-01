import axios from 'axios';
import { fnGetUserFromLocalStorage, LocalStorageKeys } from './local';

// Create an Axios instance with default settings
const apiClient = axios.create({
    baseURL: LocalStorageKeys.SERVER_API_URL, // Base URL for the API
    timeout: 10000, // Request timeout in milliseconds (10 seconds)
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        "Access-Control-Allow-Origin": "*"
    },
});

// Request Interceptor
apiClient.interceptors.request.use(
    async (config) => {
        // var token = await getUserFromToken();
        // console.log("Token from local storage:", token);
        // Add authentication token if available (e.g., from localStorage)
        var user = fnGetUserFromLocalStorage();
        console.log("User from local storage:", user);
        var empIds = user?.empid || "";

        if(config.url.indexOf("empid=")== -1){
            if (empIds) {
                config.url += config.url.indexOf("?") === -1 ? `?empid=${empIds}` : `&empid=${empIds}`;
            }
        }


        return config;
    },
    (error) => {
        // Handle request errors (e.g., network issues before the request is sent)
        return Promise.reject(error);
    }
);

// Response Interceptor
apiClient.interceptors.response.use(
    (response) => {
        // Return the response data directly if needed
        return response.data;
    },
    (error) => {
        // Handle response errors (e.g., 401 Unauthorized, 500 Server Error)
        if (error.response) {
            const { status, data } = error.response;
            if (status === 401) {
                // Example: Redirect to login or refresh token
                console.error('Unauthorized access - redirecting to login');
            } else if (status >= 500) {
                console.error('Server error occurred:', data.message || 'Unknown error');
            }
        } else if (error.request) {
            // No response received (e.g., network failure)
            console.error('Network error - please check your connection');
        }
        return Promise.reject(error);
    }
);

// Export the configured Axios instance
export default apiClient;