import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_URL = `${API_BASE_URL}/api`;

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Set axios default header if token exists
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    useEffect(() => {
        const loadUser = async () => {
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const res = await axios.get(`${API_URL}/auth/me`);
                setUser(res.data.data);
            } catch (err) {
                localStorage.removeItem('token');
                setToken(null);
                setUser(null);
                setError(err.response?.data?.error || 'Session expired');
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, [token]);

    const register = async (userData) => {
        setError(null);
        try {
            const res = await axios.post(`${API_URL}/auth/register`, userData);
            return { success: true, message: res.data.message, email: res.data.email };
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
            return { success: false };
        }
    };

    const login = async (userData) => {
        setError(null);
        try {
            const res = await axios.post(`${API_URL}/auth/login`, userData);
            if (res.data.token) {
                localStorage.setItem('token', res.data.token);
                setToken(res.data.token);
                setUser(res.data.data);
                return { success: true, verified: true };
            }
            return { success: true, verified: false, email: res.data.email };
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
            return { success: false };
        }
    };

    const verifyOTP = async (email, otp) => {
        setError(null);
        try {
            const res = await axios.post(`${API_URL}/auth/verify-otp`, { email, otp });
            const { token, user } = res.data;
            localStorage.setItem('token', token);
            setToken(token);
            setUser(user);
            return true;
        } catch (err) {
            setError(err.response?.data?.error || 'Verification failed');
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        delete axios.defaults.headers.common['Authorization'];
    };

    const refreshUser = async () => {
        if (!token) return;
        try {
            const res = await axios.get(`${API_URL}/auth/me`);
            setUser(res.data.data);
        } catch (err) {
            console.error('Failed to refresh user:', err);
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, error, register, login, logout, verifyOTP, setError, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
