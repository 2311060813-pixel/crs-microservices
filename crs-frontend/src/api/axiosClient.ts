import axios from 'axios';

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor
// Tự động lấy JWT từ localStorage.crs_token
// và gắn vào Authorization header.
axiosClient.interceptors.request.use(
    (config) => {
        const token =
            localStorage.getItem('crs_token');

        if (token) {
            config.headers.Authorization =
                `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error),
);

// Response Interceptor
// Nếu Server trả 401:
// - Xóa thông tin đăng nhập
// - Chuyển về trang login
axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (
            axios.isAxiosError(error) &&
            error.response?.status === 401
        ) {
            localStorage.removeItem('crs_auth');
            localStorage.removeItem('crs_token');
            localStorage.removeItem('crs_user');

            if (
                window.location.pathname !==
                '/login'
            ) {
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    },
);

export default axiosClient;