import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    cancelRegistration,
    getRegistrationsByStudent,
} from '../api/registrationApi';
import type { Registration } from '../types/registration';
import { useAuth } from '../context/AuthContext';

function MyRegistrationsPage() {
    const { auth } = useAuth();
    const navigate = useNavigate();

    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [cancellingId, setCancellingId] = useState<number | null>(null);
    const [message, setMessage] = useState('');

    const loadRegistrations = async (): Promise<void> => {
        if (!auth?.studentId) {
            setError('Không xác định được mã sinh viên.');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError('');

            const response = await getRegistrationsByStudent(auth.studentId);

            setRegistrations(response.data);
        } catch (err) {
            console.error(err);
            setError('Không thể tải danh sách đăng ký.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchRegistrations = async (): Promise<void> => {
            await loadRegistrations();
        };

        void fetchRegistrations();
    }, [auth?.studentId]);

    const handleCancel = async (registrationId: number): Promise<void> => {
        const confirmed = window.confirm(
            'Bạn có chắc chắn muốn hủy đăng ký học phần này không?',
        );

        if (!confirmed) {
            return;
        }

        try {
            setCancellingId(registrationId);
            setMessage('');
            setError('');

            await cancelRegistration(registrationId);

            setMessage('Hủy đăng ký thành công.');

            await loadRegistrations();
        } catch (err) {
            console.error(err);
            setError('Hủy đăng ký thất bại.');
        } finally {
            setCancellingId(null);
        }
    };

    return (
        <div
            style={{
                minHeight: '100vh',
                background: '#f5f7fb',
                fontFamily: 'Arial, sans-serif',
            }}
        >
            <header
                style={{
                    background: '#2563eb',
                    color: 'white',
                    padding: '16px 24px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <div>
                    <h2 style={{ margin: 0 }}>
                        CRS - Quản lý học phần
                    </h2>

                    <div
                        style={{
                            marginTop: '5px',
                            fontSize: '14px',
                        }}
                    >
                        Sinh viên: {auth?.username}
                    </div>
                </div>

                <button
                    onClick={() => navigate('/courses')}
                    style={{
                        padding: '9px 16px',
                        background: 'white',
                        color: '#2563eb',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 600,
                    }}
                >
                    Danh sách khóa học
                </button>
            </header>

            <main
                style={{
                    maxWidth: '1000px',
                    margin: '0 auto',
                    padding: '30px 20px',
                }}
            >
                <h1>Đăng ký của tôi</h1>

                {loading && <p>Đang tải danh sách đăng ký...</p>}

                {error && (
                    <div
                        style={{
                            padding: '12px',
                            marginBottom: '20px',
                            background: '#ffecec',
                            color: '#c00',
                            borderRadius: '6px',
                        }}
                    >
                        {error}
                    </div>
                )}

                {message && (
                    <div
                        style={{
                            padding: '12px',
                            marginBottom: '20px',
                            background: '#eaf7ea',
                            color: '#166534',
                            borderRadius: '6px',
                        }}
                    >
                        {message}
                    </div>
                )}

                {!loading && !error && registrations.length === 0 && (
                    <p>Bạn chưa đăng ký học phần nào.</p>
                )}

                {!loading && registrations.length > 0 && (
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '15px',
                        }}
                    >
                        {registrations.map((registration) => (
                            <div
                                key={registration.id}
                                style={{
                                    background: 'white',
                                    padding: '20px',
                                    borderRadius: '10px',
                                    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                                }}
                            >
                                <p>
                                    <strong>Mã đăng ký:</strong>{' '}
                                    {registration.id}
                                </p>

                                <p>
                                    <strong>Mã khóa học:</strong>{' '}
                                    {registration.courseId}
                                </p>

                                <p>
                                    <strong>Ngày đăng ký:</strong>{' '}
                                    {new Date(
                                        registration.ngayDangKy,
                                    ).toLocaleString('vi-VN')}
                                </p>

                                <p>
                                    <strong>Trạng thái:</strong>{' '}
                                    {registration.trangThai}
                                </p>

                                {registration.trangThai === 'DA_DANG_KY' && (
                                    <button
                                        onClick={() => {
                                            void handleCancel(registration.id);
                                        }}
                                        disabled={
                                            cancellingId === registration.id
                                        }
                                        style={{
                                            padding: '10px 18px',
                                            border: 'none',
                                            borderRadius: '6px',
                                            background:
                                                cancellingId === registration.id
                                                    ? '#999'
                                                    : '#dc2626',
                                            color: 'white',
                                            cursor:
                                                cancellingId === registration.id
                                                    ? 'not-allowed'
                                                    : 'pointer',
                                            fontWeight: 600,
                                        }}
                                    >
                                        {cancellingId === registration.id
                                            ? 'Đang hủy...'
                                            : 'Hủy đăng ký'}
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

export default MyRegistrationsPage;