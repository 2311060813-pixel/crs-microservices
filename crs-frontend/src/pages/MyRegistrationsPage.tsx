import {
    useCallback,
    useEffect,
    useState,
} from 'react';

import axios from 'axios';

import {
    getMyRegistrations,
    cancelRegistration,
} from '../api/registrationApi';

import { getCourseById } from '../api/courseApi';

import { useToast } from '../hooks/useToast';

import Toast from '../components/Toast';
import Navbar from '../components/Navbar';

import type { Registration } from '../types/registration';
import type { Course } from '../types/course';
import type { ApiErrorResponse } from '../types/apiError';

interface RegistrationRow extends Registration {
    courseName: string;
}

export default function MyRegistrationsPage() {
    const [rows, setRows] =
        useState<RegistrationRow[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [loadError, setLoadError] =
        useState<string | null>(null);

    const [cancellingId, setCancellingId] =
        useState<number | null>(null);

    const {
        toast,
        showToast,
        clearToast,
    } = useToast();

    const loadData = useCallback(
        async (): Promise<void> => {
            setLoadError(null);

            try {
                const response =
                    await getMyRegistrations();

                const activeRegistrations =
                    response.data.filter(
                        (registration) =>
                            registration.trangThai ===
                            'DA_DANG_KY',
                    );

                const enriched =
                    await Promise.all(
                        activeRegistrations.map(
                            async (registration) => {
                                try {
                                    const courseResponse =
                                        await getCourseById(
                                            registration.courseId,
                                        );

                                    const course =
                                        courseResponse.data as Course;

                                    return {
                                        ...registration,
                                        courseName:
                                        course.tenMonHoc,
                                    };
                                } catch {
                                    return {
                                        ...registration,
                                        courseName:
                                            `Môn học #${registration.courseId} (không tìm thấy thông tin)`,
                                    };
                                }
                            },
                        ),
                    );

                setRows(enriched);
            } catch (err: unknown) {
                let message =
                    'Không tải được danh sách đăng ký.';

                if (
                    axios.isAxiosError<ApiErrorResponse>(
                        err,
                    ) &&
                    err.response?.data?.message
                ) {
                    message =
                        err.response.data.message;
                }

                setLoadError(message);
                setRows([]);
            } finally {
                setLoading(false);
            }
        },
        [],
    );

    useEffect(() => {
        let cancelled = false;

        const fetchData = async () => {
            if (cancelled) {
                return;
            }

            setLoading(true);
            await loadData();
        };

        void fetchData();

        return () => {
            cancelled = true;
        };
    }, [loadData]);

    const handleCancel = async (
        row: RegistrationRow,
    ): Promise<void> => {
        const confirmed =
            window.confirm(
                `Hủy đăng ký môn "${row.courseName}"?`,
            );

        if (!confirmed) {
            return;
        }

        setCancellingId(row.id);

        try {
            await cancelRegistration(row.id);

            showToast(
                `Đã hủy đăng ký môn "${row.courseName}"`,
                'success',
            );

            setLoading(true);

            await loadData();
        } catch (err: unknown) {
            let message =
                'Hủy đăng ký không thành công.';

            if (
                axios.isAxiosError<ApiErrorResponse>(
                    err,
                ) &&
                err.response?.data?.message
            ) {
                message =
                    err.response.data.message;
            }

            showToast(
                message,
                'error',
            );
        } finally {
            setCancellingId(null);
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
                    maxWidth: '1000px',
                    margin: '0 auto',
                    padding: '30px 20px',
                }}
            >
                <h1>
                    Môn học đã đăng ký
                </h1>

                {loading && (
                    <p>
                        Đang tải...
                    </p>
                )}

                {!loading &&
                    loadError && (
                        <div
                            style={{
                                padding: 12,
                                marginBottom: 20,
                                background:
                                    '#ffecec',
                                color: '#b91c1c',
                                borderRadius: 6,
                            }}
                        >
                            <p>
                                {loadError}
                            </p>

                            <button
                                type="button"
                                onClick={() => {
                                    setLoading(
                                        true,
                                    );
                                    void loadData();
                                }}
                            >
                                Thử lại
                            </button>
                        </div>
                    )}

                {!loading &&
                    !loadError &&
                    rows.length === 0 && (
                        <p>
                            Bạn chưa đăng ký môn học nào.
                        </p>
                    )}

                {!loading &&
                    !loadError &&
                    rows.length > 0 && (
                        <table
                            style={{
                                width: '100%',
                                borderCollapse:
                                    'collapse',
                                background:
                                    '#ffffff',
                            }}
                        >
                            <thead>
                            <tr
                                style={{
                                    textAlign:
                                        'left',
                                    borderBottom:
                                        '2px solid #333',
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
                                    Ngày đăng ký
                                </th>

                                <th
                                    style={{
                                        padding: 12,
                                    }}
                                >
                                    Thao tác
                                </th>
                            </tr>
                            </thead>

                            <tbody>
                            {rows.map(
                                (row) => (
                                    <tr
                                        key={
                                            row.id
                                        }
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
                                            {
                                                row.courseName
                                            }
                                        </td>

                                        <td
                                            style={{
                                                padding: 12,
                                            }}
                                        >
                                            {new Date(
                                                row.ngayDangKy,
                                            ).toLocaleString(
                                                'vi-VN',
                                            )}
                                        </td>

                                        <td
                                            style={{
                                                padding: 12,
                                            }}
                                        >
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    void handleCancel(
                                                        row,
                                                    );
                                                }}
                                                disabled={
                                                    cancellingId ===
                                                    row.id
                                                }
                                            >
                                                {cancellingId ===
                                                row.id
                                                    ? 'Đang hủy...'
                                                    : 'Hủy đăng ký'}
                                            </button>
                                        </td>
                                    </tr>
                                ),
                            )}
                            </tbody>
                        </table>
                    )}

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