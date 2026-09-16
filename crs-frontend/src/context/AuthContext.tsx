import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { LoginResponse } from '../types/auth';

interface AuthContextType {
    auth: LoginResponse | null;
    login: (data: LoginResponse) => void;
    logout: () => void;
    isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [auth, setAuth] = useState<LoginResponse | null>(() => {
        const savedAuth = localStorage.getItem('crs_auth');

        if (!savedAuth) {
            return null;
        }

        try {
            return JSON.parse(savedAuth) as LoginResponse;
        } catch {
            localStorage.removeItem('crs_auth');
            return null;
        }
    });

    useEffect(() => {
        if (auth) {
            localStorage.setItem('crs_auth', JSON.stringify(auth));
        } else {
            localStorage.removeItem('crs_auth');
        }
    }, [auth]);

    const login = (data: LoginResponse) => {
        setAuth(data);
    };

    const logout = () => {
        setAuth(null);
    };

    return (
        <AuthContext.Provider
            value={{
                auth,
                login,
                logout,
                isLoggedIn: auth !== null,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth phải được sử dụng bên trong AuthProvider');
    }

    return context;
}