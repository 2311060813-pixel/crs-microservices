import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import CoursePage from './pages/CoursePage';
import MyRegistrationsPage from './pages/MyRegistrationsPage';
import { useAuth } from './context/AuthContext';

function App() {
    const { isLoggedIn } = useAuth();

    return (
        <Routes>
            <Route
                path="/"
                element={
                    <Navigate
                        to={isLoggedIn ? '/courses' : '/login'}
                        replace
                    />
                }
            />

            <Route
                path="/login"
                element={
                    isLoggedIn ? (
                        <Navigate to="/courses" replace />
                    ) : (
                        <LoginPage />
                    )
                }
            />

            <Route
                path="/courses"
                element={
                    isLoggedIn ? (
                        <CoursePage />
                    ) : (
                        <Navigate to="/login" replace />
                    )
                }
            />

            <Route
                path="/my-registrations"
                element={
                    isLoggedIn ? (
                        <MyRegistrationsPage />
                    ) : (
                        <Navigate to="/login" replace />
                    )
                }
            />

            <Route
                path="*"
                element={<Navigate to="/" replace />}
            />
        </Routes>
    );
}

export default App;