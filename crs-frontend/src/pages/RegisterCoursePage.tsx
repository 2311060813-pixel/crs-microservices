import { useState } from 'react';
import axios from 'axios';

import { useCourses } from '../api/useCourses';
import { registerCourse } from '../api/registrationApi';

import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';

import SearchBox from '../components/SearchBox';
import CourseList from '../components/CourseList';
import Pagination from '../components/Pagination';
import Toast from '../components/Toast';
import Navbar from '../components/Navbar';

import type { Course } from '../types/course';
import type { ApiErrorResponse } from '../types/apiError';

export default function RegisterCoursePage() {
    const [keyword, setKeyword] = useState('');
    const [page, setPage] = useState(0);

    // ID môn học đang được đăng ký
    // dùng để disable riêng nút đó
    const [registeringId, setRegisteringId] =
        useState<number | null>(null);

    const { auth } = useAuth();

    const {
        toast,
        showToast,
        clearToast,
    } = useToast();

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

    const handleRegister = async (
        course: Course,
    ): Promise<void> => {
        // Chưa đăng nhập thì không thực hiện
        if (!auth) {
            showToast(
                'Vui lòng đăng nhập để đăng ký học phần.',
                'error',
            );
            return;
        }

        setRegisteringId(course.id);

        try {
            await registerCourse({
                studentId: auth.userId,
                courseId: course.id,
            });

            showToast(
                `Đăng ký thành công môn "${course.tenMonHoc}"`,
                'success',
            );

            // Tải lại danh sách để số chỗ giảm ngay
            await refetch();
        } catch (err: unknown) {
            let message =
                'Đăng ký không thành công, vui lòng thử lại.';

            if (
                axios.isAxiosError<ApiErrorResponse>(
                    err,
                )
            ) {
                if (
                    err.response?.data?.message
                ) {
                    message =
                        err.response.data.message;
                } else if (
                    !err.response
                ) {
                    message =
                        'Không kết nối được tới hệ thống. Vui lòng thử lại sau.';
                }
            }

            showToast(
                message,
                'error',
            );
        } finally {
            setRegisteringId(null);
        }
    };

    return (
        <div
            style={{
                minHeight: '100vh',
                background: '#f5f7fb',
                fontFamily:
                    'Arial, sans-serif',
            }}
        >
            <Navbar />

            <main
                style={{
                    padding: 24,
                    maxWidth: 900,
                    margin: '0 auto',
                }}
            >
                <h1>
                    Đăng ký học phần
                </h1>

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
                        onRetry={
                            refetch
                        }
                        onRegister={
                            handleRegister
                        }
                        registeringId={
                            registeringId
                        }
                    />
                </div>

                <Pagination
                    currentPage={page}
                    totalPages={
                        totalPages
                    }
                    onPageChange={
                        setPage
                    }
                />

                {toast && (
                    <Toast
                        message={
                            toast.message
                        }
                        type={
                            toast.type
                        }
                        onClose={
                            clearToast
                        }
                    />
                )}
            </main>
        </div>
    );
}