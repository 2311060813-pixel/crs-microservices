import {
    useCallback,
    useState,
} from 'react';
import axios from 'axios';

import { useCourses } from '../api/useCourses';

import {
    createCourse,
    updateCourse,
    deleteCourse,
} from '../api/courseApi';

import SearchBox from '../components/SearchBox';
import CourseList from '../components/CourseList';
import Pagination from '../components/Pagination';
import CourseForm from '../components/CourseForm';
import Navbar from '../components/Navbar';

import type {
    Course,
    CourseFormValues,
} from '../types/course';

import type {
    ApiErrorResponse,
} from '../types/apiError';

function AdminCoursesPage() {
    const [keyword, setKeyword] = useState('');
    const [page, setPage] = useState(0);

    const [editingCourse, setEditingCourse] =
        useState<Course | null>(null);

    const [submitting, setSubmitting] =
        useState(false);

    const [formError, setFormError] =
        useState<string | null>(null);

    const {
        courses,
        totalPages,
        state,
        errorMessage,
        refetch,
    } = useCourses(keyword, page);

    // Xử lý tìm kiếm
    const handleSearch = useCallback(
        (newKeyword: string) => {
            setKeyword(newKeyword);
            setPage(0);
        },
        [],
    );

    // Chuyển sang form thêm mới
    const handleNewCourse = () => {
        setEditingCourse(null);
        setFormError(null);
    };

    // Chuyển sang form chỉnh sửa
    const handleEdit = (
        course: Course,
    ) => {
        setFormError(null);
        setEditingCourse(course);
    };

    // Hủy chỉnh sửa
    const handleCancelEdit = () => {
        setEditingCourse(null);
        setFormError(null);
    };

    // Lấy thông báo lỗi từ Backend
    const extractErrorMessage = (
        err: unknown,
    ): string => {
        if (
            axios.isAxiosError<ApiErrorResponse>(
                err,
            )
        ) {
            const data = err.response?.data;

            if (data?.message) {
                return data.message;
            }

            if (data) {
                const firstFieldError =
                    Object.values(data).find(
                        (value) =>
                            typeof value ===
                            'string',
                    );

                if (firstFieldError) {
                    return firstFieldError;
                }
            }

            // Không kết nối được Backend
            if (!err.response) {
                return 'Không kết nối được tới hệ thống. Vui lòng thử lại sau.';
            }

            // 401 - chưa xác thực / token lỗi
            if (
                err.response.status === 401
            ) {
                return 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn.';
            }

            // 403 - không đủ quyền
            if (
                err.response.status === 403
            ) {
                return 'Bạn không có quyền thực hiện thao tác này.';
            }
        }

        return 'Đã xảy ra lỗi, vui lòng thử lại.';
    };

    // Thêm hoặc cập nhật môn học
    const handleFormSubmit = async (
        values: CourseFormValues,
    ): Promise<void> => {
        setSubmitting(true);
        setFormError(null);

        try {
            if (editingCourse) {
                // UPDATE
                await updateCourse(
                    editingCourse.id,
                    values,
                );
            } else {
                // CREATE
                await createCourse(values);
            }

            // Reset form
            setEditingCourse(null);
            setFormError(null);

            // Tải lại danh sách
            await refetch();
        } catch (err) {
            setFormError(
                extractErrorMessage(err),
            );
        } finally {
            setSubmitting(false);
        }
    };

    // Xóa môn học
    const handleDelete = async (
        course: Course,
    ): Promise<void> => {
        const confirmed =
            window.confirm(
                `Xóa môn học "${course.tenMonHoc}"?`,
            );

        if (!confirmed) {
            return;
        }

        try {
            setFormError(null);

            await deleteCourse(course.id);

            // Nếu xóa phần tử cuối của trang
            // và đang ở trang > 0
            if (
                courses.length === 1 &&
                page > 0
            ) {
                setPage(page - 1);
            } else {
                await refetch();
            }
        } catch (err) {
            window.alert(
                extractErrorMessage(err),
            );
        }
    };

    return (
        <div
            style={{
                minHeight: '100vh',
                background: '#f5f7fb',
                fontFamily: 'sans-serif',
            }}
        >
            {/* NAVBAR */}
            <Navbar />

            {/* NỘI DUNG ADMIN */}
            <main
                style={{
                    padding: 24,
                    maxWidth: 900,
                    margin: '0 auto',
                }}
            >
                {/* TIÊU ĐỀ + NÚT THÊM */}
                <div
                    style={{
                        display: 'flex',
                        justifyContent:
                            'space-between',
                        alignItems: 'center',
                        gap: 20,
                        marginBottom: 20,
                    }}
                >
                    <h1>
                        Quản lý môn học (Admin)
                    </h1>

                    <button
                        type="button"
                        onClick={
                            handleNewCourse
                        }
                    >
                        Thêm môn học
                    </button>
                </div>

                {/* FORM THÊM / SỬA */}
                <CourseForm
                    key={
                        editingCourse?.id ??
                        'new'
                    }
                    editingCourse={
                        editingCourse
                    }
                    onSubmit={
                        handleFormSubmit
                    }
                    onCancel={
                        handleCancelEdit
                    }
                    submitting={
                        submitting
                    }
                    serverError={
                        formError
                    }
                />

                {/* TÌM KIẾM */}
                <SearchBox
                    onSearch={
                        handleSearch
                    }
                />

                {/* DANH SÁCH */}
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
                        onEdit={
                            handleEdit
                        }
                        onDelete={
                            handleDelete
                        }
                    />
                </div>

                {/* PHÂN TRANG */}
                <Pagination
                    currentPage={page}
                    totalPages={
                        totalPages
                    }
                    onPageChange={
                        setPage
                    }
                />
            </main>
        </div>
    );
}

export default AdminCoursesPage;