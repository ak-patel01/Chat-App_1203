import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5256/api', // Verify port later
});

const authApi = axios.create({
    baseURL: 'http://localhost:5256/api',
});

type RetriableRequestConfig = {
    _retry?: boolean;
    headers?: Record<string, string>;
};

const clearAuthAndRedirect = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userType');
    localStorage.removeItem('role');
    localStorage.removeItem('userName');

    if (window.location.pathname !== '/login') {
        window.location.href = '/login';
    }
};

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Redirect to login on 401 Unauthorized
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = (error.config ?? {}) as RetriableRequestConfig;

        if (error.response?.status === 401 && !originalRequest._retry) {
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) {
                clearAuthAndRedirect();
                return Promise.reject(error);
            }

            try {
                originalRequest._retry = true;
                const refreshResponse = await authApi.post('/auth/refresh', { refreshToken });

                const nextAccessToken = refreshResponse.data.token as string;
                const nextRefreshToken = refreshResponse.data.refreshToken as string;

                localStorage.setItem('token', nextAccessToken);
                localStorage.setItem('refreshToken', nextRefreshToken);

                originalRequest.headers = {
                    ...(originalRequest.headers ?? {}),
                    Authorization: `Bearer ${nextAccessToken}`,
                };

                return api(originalRequest);
            } catch {
                clearAuthAndRedirect();
                return Promise.reject(error);
            }
        }

        if (error.response?.status === 401) {
            clearAuthAndRedirect();
        }

        return Promise.reject(error);
    }
);

export default api;
