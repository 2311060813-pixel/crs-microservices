import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useCourses } from '../api/useCourses';
import SearchBox from '../components/SearchBox';
import CourseList from '../components/CourseList';
import Pagination from '../components/Pagination';
import { useAuth } from '../context/AuthContext';

export default function CoursesPage() {
    const [keyword, setKeyword] = useState('');
    const [page, setPage] = useState(0);

    const navigate = useNavigate();

    const {
        auth,
        isLoggedIn,
        logout,
    } = useAuth();

    const {
        courses,
        totalPages,
        state,
        errorMessage,
        refetch,
    } = useCourses(keyword, page);

    const handleSearch = (
        newKeyword: string,
    ) => {
        setKeyword(newKeyword);
        setPage(0);
    };

    const handleLogout = () => {
        logout();
        navigate('/login', {
            replace: true,
        });
    };

    return (
        <div
            style={{
                padding: 24,
                fontFamily: 'sans-serif',
                maxWidth: 900,
                margin: '0 auto',
            }}
        >
            {/* HEADER */}
            <header
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 20,
                    marginBottom: 30,
                    paddingBottom: 16,
                    borderBottom: '1px solid #ddd',
                }}
            >
                {/* Tiêu đề */}
                <div>
                    <h2
                        style={{
                            margin: 0,
                            marginBottom: 8,
                        }}
                    >
                        CRS - Quản lý học phần
                    </h2>

                    {isLoggedIn && auth && (
                        <div
                            style={{
                                fontSize: 14,
                                color: '#555',
                            }}
                        >
                            Xin chào:{' '}
                            <strong>
                                {auth.username}
                            </strong>{' '}
                            ({auth.role})
                        </div>
                    )}
                </div>

                {/* CÁC NÚT */}
                <div
                    style={{
                        display: 'flex',
                        gap: 8,
                        flexWrap: 'wrap',
                        justifyContent: 'flex-end',
                    }}
                >
                    {/* ADMIN */}
                    {isLoggedIn &&
                        auth?.role === 'ADMIN' && (
                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        '/admin/courses',
                                    )
                                }
                            >
                                Quản lý môn học
                            </button>
                        )}

                    {/* STUDENT */}
                    {isLoggedIn &&
                        auth?.role === 'STUDENT' && (
                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        '/my-registrations',
                                    )
                                }
                            >
                                Đăng ký của tôi
                            </button>
                        )}

                    {/* ĐĂNG XUẤT / ĐĂNG NHẬP */}
                    {isLoggedIn ? (
                        <button
                            type="button"
                            onClick={handleLogout}
                        >
                            Đăng xuất
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={() =>
                                navigate('/login')
                            }
                        >
                            Đăng nhập
                        </button>
                    )}
                </div>
            </header>

            {/* DANH SÁCH MÔN HỌC */}
            <main>
                <h1>Danh sách môn học</h1>

                <SearchBox
                    onSearch={handleSearch}
                />

                <div
                    style={{
                        marginTop: 16,
                    }}
                >
                    <CourseList
                        courses={courses}
                        state={state}
                        errorMessage={
                            errorMessage
                        }
                        onRetry={refetch}
                    />
                </div>

                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                />
            </main>
        </div>
    );
}