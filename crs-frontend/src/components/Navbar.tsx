import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const {
        auth,
        isLoggedIn,
        logout,
    } = useAuth();

    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login', {
            replace: true,
        });
    };

    return (
        <nav
            style={{
                display: 'flex',
                gap: 16,
                padding: 12,
                borderBottom: '1px solid #ddd',
                alignItems: 'center',
                marginBottom: 24,
            }}
        >
            {/* Trang danh sách môn học */}
            <Link to="/courses">
                Danh sách môn học
            </Link>

            {/* Chỉ ADMIN mới thấy */}
            {isLoggedIn &&
                auth?.role === 'ADMIN' && (
                    <>
                        <Link to="/admin/courses">
                            Quản lý môn học
                        </Link>

                        <Link to="/admin/api-keys">
                            Quản lý API Key
                        </Link>
                    </>
                )}

            {/* Chỉ STUDENT mới thấy */}
            {isLoggedIn &&
                auth?.role === 'STUDENT' && (
                    <Link to="/my-registrations">
                        Đăng ký của tôi
                    </Link>
                )}

            {/* Khu vực bên phải */}
            <div
                style={{
                    marginLeft: 'auto',
                }}
            >
                {isLoggedIn ? (
                    <>
                        <span
                            style={{
                                marginRight: 12,
                            }}
                        >
                            Xin chào,{' '}
                            <strong>
                                {auth?.username}
                            </strong>{' '}
                            ({auth?.role})
                        </span>

                        <button
                            type="button"
                            onClick={handleLogout}
                        >
                            Đăng xuất
                        </button>
                    </>
                ) : (
                    <Link to="/login">
                        Đăng nhập
                    </Link>
                )}
            </div>
        </nav>
    );
}