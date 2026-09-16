import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCourses } from '../api/courseApi';
import { createRegistration } from '../api/registrationApi';
import type { Course, PagedResponse } from '../types/course';
import { useAuth } from '../context/AuthContext';

function CoursePage() {
    const { auth, logout } = useAuth();
    const navigate = useNavigate();

    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [registeringCourseId, setRegisteringCourseId] = useState<number | null>(null);
    const [registerMessage, setRegisterMessage] = useState('');

    const loadCourses = async (): Promise<void> => {
        try {
            setLoading(true);
            setError('');

            const response = await getCourses();
            const data = response.data as PagedResponse<Course>;

            setCourses(data.content);
        } catch (err) {
            console.error(err);
            setError('Không thể tải danh sách khóa học.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchCourses = async (): Promise<void> => {
            await loadCourses();
        };

        void fetchCourses();
    }, []);

    const handleRegister = async (courseId: number): Promise<void> => {
        if (!auth?.studentId) {
            setRegisterMessage('Không xác định được mã sinh viên.');
            return;
        }

        try {
            setRegisteringCourseId(courseId);
            setRegisterMessage('');
            setError('');

            await createRegistration({
                studentId: auth.studentId,
                courseId,
            });

            setRegisterMessage(
                `Đăng ký học phần "${courseId}" thành công.`,
            );

            await loadCourses();
        } catch (err) {
            console.error(err);

            setRegisterMessage(
                'Đăng ký thất bại. Có thể bạn đã đăng ký học phần này hoặc khóa học đã hết chỗ.',
            );
        } finally {
            setRegisteringCourseId(null);
        }
    };

    const handleLogout = () => {
        logout();
        window.location.href = '/login';
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
                    gap: '20px',
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
                        Xin chào: {auth?.username} ({auth?.role})
                    </div>
                </div>

                <div
                    style={{
                        display: 'flex',
                        gap: '10px',
                        alignItems: 'center',
                    }}
                >
                    {auth?.role === 'STUDENT' && (
                        <button
                            onClick={() => navigate('/my-registrations')}
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
                            Đăng ký của tôi
                        </button>
                    )}

                    <button
                        onClick={handleLogout}
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
                        Đăng xuất
                    </button>
                </div>
            </header>

            <main
                style={{
                    maxWidth: '1100px',
                    margin: '0 auto',
                    padding: '30px 20px',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '20px',
                    }}
                >
                    <h1 style={{ margin: 0 }}>
                        Danh sách khóa học
                    </h1>

                    <button
                        onClick={() => {
                            void loadCourses();
                        }}
                        style={{
                            padding: '9px 16px',
                            border: '1px solid #2563eb',
                            background: 'white',
                            color: '#2563eb',
                            borderRadius: '6px',
                            cursor: 'pointer',
                        }}
                    >
                        Làm mới
                    </button>
                </div>

                {loading && (
                    <p>Đang tải danh sách khóa học...</p>
                )}

                {error && (
                    <div
                        style={{
                            padding: '12px',
                            background: '#ffecec',
                            color: '#c00',
                            borderRadius: '6px',
                            marginBottom: '20px',
                        }}
                    >
                        {error}
                    </div>
                )}

                {registerMessage && (
                    <div
                        style={{
                            padding: '12px',
                            background: '#eaf7ea',
                            color: '#166534',
                            borderRadius: '6px',
                            marginBottom: '20px',
                        }}
                    >
                        {registerMessage}
                    </div>
                )}

                {!loading &&
                    !error &&
                    courses.length === 0 && (
                        <p>Chưa có khóa học nào.</p>
                    )}

                {!loading && courses.length > 0 && (
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns:
                                'repeat(auto-fit, minmax(280px, 1fr))',
                            gap: '20px',
                        }}
                    >
                        {courses.map((course) => (
                            <div
                                key={course.id}
                                style={{
                                    background: 'white',
                                    borderRadius: '10px',
                                    padding: '20px',
                                    boxShadow:
                                        '0 2px 10px rgba(0,0,0,0.08)',
                                }}
                            >
                                <h3
                                    style={{
                                        marginTop: 0,
                                        marginBottom: '15px',
                                    }}
                                >
                                    {course.tenMonHoc}
                                </h3>

                                <p>
                                    <strong>
                                        Mã khóa học:
                                    </strong>{' '}
                                    {course.id}
                                </p>

                                <p>
                                    <strong>
                                        Số tín chỉ:
                                    </strong>{' '}
                                    {course.soTinChi}
                                </p>

                                <p>
                                    <strong>
                                        Số chỗ tối đa:
                                    </strong>{' '}
                                    {course.soChoToiDa}
                                </p>

                                <p>
                                    <strong>
                                        Số chỗ còn lại:
                                    </strong>{' '}
                                    {course.soChoConLai}
                                </p>

                                {auth?.role === 'STUDENT' && (
                                    <button
                                        onClick={() => {
                                            void handleRegister(course.id);
                                        }}
                                        disabled={
                                            registeringCourseId === course.id ||
                                            course.soChoConLai <= 0
                                        }
                                        style={{
                                            width: '100%',
                                            marginTop: '10px',
                                            padding: '10px',
                                            border: 'none',
                                            borderRadius: '6px',
                                            cursor:
                                                registeringCourseId === course.id ||
                                                course.soChoConLai <= 0
                                                    ? 'not-allowed'
                                                    : 'pointer',
                                            background:
                                                registeringCourseId === course.id ||
                                                course.soChoConLai <= 0
                                                    ? '#999'
                                                    : '#16a34a',
                                            color: 'white',
                                            fontWeight: 600,
                                        }}
                                    >
                                        {registeringCourseId === course.id
                                            ? 'Đang đăng ký...'
                                            : course.soChoConLai <= 0
                                                ? 'Hết chỗ'
                                                : 'Đăng ký'}
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

export default CoursePage;