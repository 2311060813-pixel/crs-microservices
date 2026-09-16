import type { Course } from '../types/course';
import type { LoadState } from '../api/useCourses';

interface CourseListProps {
    courses: Course[];
    state: LoadState;
    errorMessage: string;
    onRetry: () => void;

    // Dùng cho Admin
    onEdit?: (course: Course) => void;
    onDelete?: (course: Course) => void;

    // Dùng cho Student
    onRegister?: (course: Course) => void;
    registeringId?: number | null;
}

export default function CourseList({
                                       courses,
                                       state,
                                       errorMessage,
                                       onRetry,
                                       onEdit,
                                       onDelete,
                                       onRegister,
                                       registeringId,
                                   }: CourseListProps) {

    // Đang tải
    if (state === 'loading') {
        return (
            <p>
                Đang tải danh sách môn học...
            </p>
        );
    }

    // Có lỗi
    if (state === 'error') {
        return (
            <div
                style={{
                    color: '#b91c1c',
                }}
            >
                <p>{errorMessage}</p>

                <button
                    type="button"
                    onClick={onRetry}
                >
                    Thử lại
                </button>
            </div>
        );
    }

    // Không có dữ liệu
    if (state === 'empty') {
        return (
            <p>
                Không tìm thấy môn học nào phù hợp.
            </p>
        );
    }

    // Hiện cột "Thao tác" nếu có ít nhất
    // một trong các chức năng Sửa, Xóa, Đăng ký
    const showActions =
        Boolean(onEdit) ||
        Boolean(onDelete) ||
        Boolean(onRegister);

    return (
        <table
            style={{
                width: '100%',
                borderCollapse: 'collapse',
            }}
        >
            <thead>
            <tr
                style={{
                    textAlign: 'left',
                    borderBottom: '2px solid #333',
                }}
            >
                <th
                    style={{
                        padding: 12,
                    }}
                >
                    Tên môn học
                </th>

                <th
                    style={{
                        padding: 12,
                    }}
                >
                    Số tín chỉ
                </th>

                <th
                    style={{
                        padding: 12,
                    }}
                >
                    Số chỗ còn lại
                </th>

                {showActions && (
                    <th
                        style={{
                            padding: 12,
                        }}
                    >
                        Thao tác
                    </th>
                )}
            </tr>
            </thead>

            <tbody>
            {courses.map((course) => (
                <tr
                    key={course.id}
                    style={{
                        borderBottom:
                            '1px solid #eee',
                    }}
                >
                    <td
                        style={{
                            padding: 12,
                        }}
                    >
                        {course.tenMonHoc}
                    </td>

                    <td
                        style={{
                            padding: 12,
                        }}
                    >
                        {course.soTinChi}
                    </td>

                    <td
                        style={{
                            padding: 12,
                            color:
                                course.soChoConLai === 0
                                    ? '#b91c1c'
                                    : 'inherit',
                        }}
                    >
                        {course.soChoConLai} /{' '}
                        {course.soChoToiDa}
                    </td>

                    {showActions && (
                        <td
                            style={{
                                padding: 12,
                            }}
                        >
                            {/* Sửa - Admin */}
                            {onEdit && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        onEdit(course)
                                    }
                                >
                                    Sửa
                                </button>
                            )}

                            {/* Xóa - Admin */}
                            {onDelete && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        onDelete(course)
                                    }
                                    style={{
                                        marginLeft:
                                            onEdit
                                                ? 8
                                                : 0,
                                        color: '#b91c1c',
                                    }}
                                >
                                    Xóa
                                </button>
                            )}

                            {/* Đăng ký - Student */}
                            {onRegister && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        onRegister(course)
                                    }
                                    disabled={
                                        course.soChoConLai ===
                                        0 ||
                                        registeringId ===
                                        course.id
                                    }
                                    style={{
                                        marginLeft:
                                            onEdit ||
                                            onDelete
                                                ? 8
                                                : 0,
                                    }}
                                >
                                    {registeringId ===
                                    course.id
                                        ? 'Đang đăng ký...'
                                        : course.soChoConLai ===
                                        0
                                            ? 'Hết chỗ'
                                            : 'Đăng ký'}
                                </button>
                            )}
                        </td>
                    )}
                </tr>
            ))}
            </tbody>
        </table>
    );
}