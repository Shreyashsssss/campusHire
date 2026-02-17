import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, Student } from '../types';
import { api } from '../services/api';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, role: 'student' | 'company', newStudentData?: Partial<Student>) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check local storage for persisted session
        const storedUser = localStorage.getItem('user_session');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, role: 'student' | 'company', newStudentData?: Partial<Student>) => {
        setIsLoading(true);
        try {
            let data;
            if (role === 'student' && newStudentData) {
                // Register logic
                // Pass all data including skills/cpg
                data = await api.register({ ...newStudentData, email, role });
            } else {
                // Login logic
                data = await api.login(email, role);
            }

            setUser(data.user);
            localStorage.setItem('user_session', JSON.stringify(data.user));
            // Store token if needed: localStorage.setItem('token', data.token);
        } catch (error) {
            console.error(error);
            alert("Authentication failed: " + (error instanceof Error ? error.message : "Unknown error"));
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user_session');
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
