import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
    children: ReactNode;
    requiredRole?: 'ADMIN' | 'STUDENT';
}

function ProtectedRoute({
                            children,
                            requiredRole,
                        }: ProtectedRouteProps) {
    const { auth, isLoggedIn } = useAuth();

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    if (
        requiredRole &&
        auth?.role !== requiredRole
    ) {
        return (
            <Navigate
                to="/courses"
                replace
            />
        );
    }

    return <>{children}</>;
}

export default ProtectedRoute;