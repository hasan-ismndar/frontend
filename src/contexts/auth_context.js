import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const AuthContext = createContext();

const api = axios.create({
    baseURL: 'http://localhost:8000',
    withCredentials: true,
});

export const AuthProvider = ({ children }) => {
    const router = useRouter();

    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [loading, setLoading] = useState(true);

    let isRefreshing = false;
    let failedQueue = [];

    const processQueue = (error, token = null) => {
        failedQueue.forEach(prom => {
            if (error) {
                prom.reject(error);
            } else {
                prom.resolve(token);
            }
        });
        failedQueue = [];
    };

    api.interceptors.request.use(
        (config) => {
            if (accessToken) {
                config.headers['Authorization'] = 'Bearer ' + accessToken;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    api.interceptors.response.use(
        (response) => response,
        (error) => {
            const originalRequest = error.config;

            if (error.response?.status === 401 && !originalRequest._retry) {
                if (isRefreshing) {
                    return new Promise(function (resolve, reject) {
                        failedQueue.push({ resolve, reject });
                    })
                        .then((token) => {
                            originalRequest.headers['Authorization'] = 'Bearer ' + token;
                            return api(originalRequest);
                        })
                        .catch((err) => Promise.reject(err));
                }

                originalRequest._retry = true;
                isRefreshing = true;

                return new Promise(function (resolve, reject) {
                    api.post('/refresh')
                        .then(({ data }) => {
                            setAccessToken(data.accessToken);
                            processQueue(null, data.accessToken);
                            originalRequest.headers['Authorization'] = 'Bearer ' + data.accessToken;
                            resolve(api(originalRequest));
                        })
                        .catch((err) => {
                            processQueue(err, null);
                            logout();
                            reject(err);
                        })
                        .finally(() => {
                            isRefreshing = false;
                        });
                });
            }

            return Promise.reject(error);
        }
    );

    const login = async (credentials, password) => {
        const res = await api.post('/tokens', { credentials, password });
        setAccessToken(res.data.accessToken);
        setUser(res.data.user);
        router.push('/dashboard');
    };

    const logout = async () => {
        try {
            await api.post('/logout');
            setUser(null);
            setAccessToken(null);
            router.push('/login');
        } catch (err) {
            console.error('فشل تسجيل الخروج', err);
        }
    };
    // const logout = () => {
    //     setAccessToken(null);
    //     setUser(null);
    //     router.push('/login');
    // };

    useEffect(() => {
        const fetchAccessToken = async () => {
            try {
                const res = await api.post('/refresh');
                setAccessToken(res.data.accessToken);
                const userRes = await api.get('/me', {
                    headers: { Authorization: `Bearer ${res.data.accessToken}` },
                });
                setUser(userRes.data.user);
            } catch {
                setAccessToken(null);
                setUser(null);
                router.push('/login');
            } finally {
                setLoading(false);
            }
        };

        fetchAccessToken();
    }, []);

    return (
        <AuthContext.Provider
            value={{ user, accessToken, login, logout, loading, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
export { api };