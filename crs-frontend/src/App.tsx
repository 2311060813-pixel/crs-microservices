import { Navigate, Route, Routes } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import CoursesPage from './pages/CoursesPage';
import RegisterCoursePage from './pages/RegisterCoursePage';
import MyRegistrationsPage from './pages/MyRegistrationsPage';
import AdminCoursesPage from './pages/AdminCoursesPage';
import ApiKeysPage from './pages/ApiKeysPage';

import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';

function App() {
    const { auth, isLoggedIn } = useAuth();

    return (
        <Routes>

            {/* Trang mặc định */}
            <Route
                path="/"
                element={
                    <Navigate
                        to={
                            !isLoggedIn
                                ? '/login'
                                : auth?.role === 'ADMIN'
                                    ? '/admin/courses'
                                    : '/courses'
                        }
                        replace
                    />
                }
            />

            {/* Trang đăng nhập */}
            <Route
                path="/login"
                element={
                    !isLoggedIn ? (
                        <LoginPage />
                    ) : auth?.role === 'ADMIN' ? (
                        <Navigate
                            to="/admin/courses"
                            replace
                        />
                    ) : (
                        <Navigate
                            to="/courses"
                            replace
                        />
                    )
                }
            />

            {/* Danh sách môn học */}
            <Route
                path="/courses"
                element={<CoursesPage />}
            />

            {/* Đăng ký học phần - STUDENT */}
            <Route
                path="/register-course"
                element={
                    <ProtectedRoute requiredRole="STUDENT">
                        <RegisterCoursePage />
                    </ProtectedRoute>
                }
            />

            {/* Môn học đã đăng ký - STUDENT */}
            <Route
                path="/my-registrations"
                element={
                    <ProtectedRoute requiredRole="STUDENT">
                        <MyRegistrationsPage />
                    </ProtectedRoute>
                }
            />

            {/* Quản lý môn học - ADMIN */}
            <Route
                path="/admin/courses"
                element={
                    <ProtectedRoute requiredRole="ADMIN">
                        <AdminCoursesPage />
                    </ProtectedRoute>
                }
            />

            {/* Quản lý API Key - ADMIN */}
            <Route
                path="/admin/api-keys"
                element={
                    <ProtectedRoute requiredRole="ADMIN">
                        <ApiKeysPage />
                    </ProtectedRoute>
                }
            />

            {/* URL không tồn tại */}
            <Route
                path="*"
                element={
                    <Navigate
                        to="/"
                        replace
                    />
                }
            />

        </Routes>
    );
}

export default App;