import {
    createContext,
    useContext,
    useState,
    type ReactNode,
} from 'react';

import type { LoginResponse } from '../types/auth';

interface AuthContextType {
    auth: LoginResponse | null;
    login: (data: LoginResponse) => void;
    logout: () => void;
    isLoggedIn: boolean;
}

const AuthContext =
    createContext<AuthContextType | undefined>(
        undefined,
    );

const AUTH_KEY = 'crs_auth';
const TOKEN_KEY = 'crs_token';
const USER_KEY = 'crs_user';

interface AuthProviderProps {
    children: ReactNode;
}

function getSavedAuth(): LoginResponse | null {
    const savedAuth =
        localStorage.getItem(AUTH_KEY);

    if (!savedAuth) {
        return null;
    }

    try {
        return JSON.parse(
            savedAuth,
        ) as LoginResponse;
    } catch {
        localStorage.removeItem(AUTH_KEY);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        return null;
    }
}

export function AuthProvider({
                                 children,
                             }: AuthProviderProps) {
    const [auth, setAuth] =
        useState<LoginResponse | null>(
            getSavedAuth,
        );

    const login = (data: LoginResponse) => {
        localStorage.setItem(
            AUTH_KEY,
            JSON.stringify(data),
        );

        localStorage.setItem(
            TOKEN_KEY,
            data.token,
        );

        localStorage.setItem(
            USER_KEY,
            JSON.stringify({
                username: data.username,
                role: data.role,
            }),
        );

        setAuth(data);
    };

    const logout = () => {
        localStorage.removeItem(AUTH_KEY);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);

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

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextType {
    const context =
        useContext(AuthContext);

    if (!context) {
        throw new Error(
            'useAuth phải được sử dụng bên trong AuthProvider',
        );
    }

    return context;
}