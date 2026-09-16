import axios from 'axios';

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosClient.interceptors.request.use(
    (config) => {
        const savedAuth = localStorage.getItem('crs_auth');

        if (savedAuth) {
            try {
                const auth = JSON.parse(savedAuth) as {
                    token?: string;
                };

                if (auth.token) {
                    config.headers.Authorization = `Bearer ${auth.token}`;
                }
            } catch {
                localStorage.removeItem('crs_auth');
            }
        }

        return config;
    },
    (error) => Promise.reject(error),
);

export default axiosClient;