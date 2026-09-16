import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/authApi';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
    const navigate = useNavigate();
    const { login: saveLogin } = useAuth();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setError('');

        if (!username.trim() || !password.trim()) {
            setError('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.');
            return;
        }

        try {
            setLoading(true);

            const response = await login({
                username: username.trim(),
                password,
            });

            saveLogin(response.data);

            navigate('/courses');
        } catch (err) {
            console.error(err);
            setError('Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản hoặc mật khẩu.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#f5f7fb',
                padding: '20px',
            }}
        >
            <div
                style={{
                    width: '100%',
                    maxWidth: '420px',
                    background: '#ffffff',
                    padding: '32px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                }}
            >
                <h1
                    style={{
                        textAlign: 'center',
                        marginBottom: '8px',
                    }}
                >
                    Đăng nhập CRS
                </h1>

                <p
                    style={{
                        textAlign: 'center',
                        color: '#666',
                        marginBottom: '24px',
                    }}
                >
                    Hệ thống quản lý đăng ký học phần
                </p>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '16px' }}>
                        <label
                            htmlFor="username"
                            style={{
                                display: 'block',
                                marginBottom: '6px',
                                fontWeight: 600,
                            }}
                        >
                            Tên đăng nhập
                        </label>

                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(event) => setUsername(event.target.value)}
                            placeholder="Nhập tên đăng nhập"
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '10px 12px',
                                border: '1px solid #ccc',
                                borderRadius: '6px',
                                boxSizing: 'border-box',
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                        <label
                            htmlFor="password"
                            style={{
                                display: 'block',
                                marginBottom: '6px',
                                fontWeight: 600,
                            }}
                        >
                            Mật khẩu
                        </label>

                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder="Nhập mật khẩu"
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '10px 12px',
                                border: '1px solid #ccc',
                                borderRadius: '6px',
                                boxSizing: 'border-box',
                            }}
                        />
                    </div>

                    {error && (
                        <div
                            style={{
                                marginBottom: '16px',
                                padding: '10px',
                                background: '#ffecec',
                                color: '#c00',
                                borderRadius: '6px',
                            }}
                        >
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '11px',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            background: '#2563eb',
                            color: '#fff',
                            fontSize: '16px',
                            fontWeight: 600,
                        }}
                    >
                        {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                    </button>
                </form>

                <div
                    style={{
                        marginTop: '24px',
                        padding: '12px',
                        background: '#f8fafc',
                        borderRadius: '6px',
                        fontSize: '14px',
                    }}
                >
                    <div>
                        <strong>Admin:</strong> admin / admin123
                    </div>

                    <div style={{ marginTop: '6px' }}>
                        <strong>Student:</strong> student1 / student123
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;