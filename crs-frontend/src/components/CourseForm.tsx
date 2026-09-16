import { useState } from 'react';
import type {
    Course,
    CourseFormValues,
} from '../types/course';
import { emptyCourseForm } from '../types/course';

interface CourseFormProps {
    editingCourse: Course | null;
    onSubmit: (
        values: CourseFormValues,
    ) => Promise<void>;
    onCancel: () => void;
    submitting: boolean;
    serverError: string | null;
}

function getInitialValues(
    editingCourse: Course | null,
): CourseFormValues {
    if (editingCourse) {
        return {
            tenMonHoc: editingCourse.tenMonHoc,
            soTinChi: String(
                editingCourse.soTinChi,
            ),
            soChoToiDa: String(
                editingCourse.soChoToiDa,
            ),
        };
    }

    return emptyCourseForm;
}

export default function CourseForm({
                                       editingCourse,
                                       onSubmit,
                                       onCancel,
                                       submitting,
                                       serverError,
                                   }: CourseFormProps) {
    const [values, setValues] =
        useState<CourseFormValues>(() =>
            getInitialValues(editingCourse),
        );

    const [clientErrors, setClientErrors] =
        useState<
            Partial<CourseFormValues>
        >({});

    const validate = (): boolean => {
        const errors: Partial<CourseFormValues> =
            {};

        if (!values.tenMonHoc.trim()) {
            errors.tenMonHoc =
                'Tên môn học không được để trống';
        }

        const soTinChi = Number(
            values.soTinChi,
        );

        if (
            !values.soTinChi ||
            Number.isNaN(soTinChi) ||
            soTinChi <= 0
        ) {
            errors.soTinChi =
                'Số tín chỉ phải là số lớn hơn 0';
        }

        const soChoToiDa = Number(
            values.soChoToiDa,
        );

        if (
            !values.soChoToiDa ||
            Number.isNaN(soChoToiDa) ||
            soChoToiDa <= 0
        ) {
            errors.soChoToiDa =
                'Số chỗ tối đa phải là số lớn hơn 0';
        }

        setClientErrors(errors);

        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (
        event: React.SyntheticEvent<HTMLFormElement>,
    ): Promise<void> => {
        event.preventDefault();

        if (!validate()) {
            return;
        }

        await onSubmit(values);
    };

    return (
        <form
            onSubmit={handleSubmit}
            style={{
                border: '1px solid #ddd',
                padding: 16,
                borderRadius: 8,
                marginBottom: 16,
                background: 'white',
            }}
        >
            <h3>
                {editingCourse
                    ? 'Sửa môn học'
                    : 'Thêm môn học mới'}
            </h3>

            <div
                style={{
                    marginBottom: 12,
                }}
            >
                <label htmlFor="tenMonHoc">
                    Tên môn học
                </label>
                <br />

                <input
                    id="tenMonHoc"
                    type="text"
                    value={values.tenMonHoc}
                    onChange={(event) =>
                        setValues({
                            ...values,
                            tenMonHoc:
                            event.target.value,
                        })
                    }
                    style={{
                        width: '100%',
                        maxWidth: 500,
                        padding: 8,
                        boxSizing: 'border-box',
                    }}
                />

                {clientErrors.tenMonHoc && (
                    <p
                        style={{
                            color: '#b91c1c',
                            margin: '4px 0 0',
                        }}
                    >
                        {
                            clientErrors.tenMonHoc
                        }
                    </p>
                )}
            </div>

            <div
                style={{
                    marginBottom: 12,
                }}
            >
                <label htmlFor="soTinChi">
                    Số tín chỉ
                </label>
                <br />

                <input
                    id="soTinChi"
                    type="number"
                    min="1"
                    value={values.soTinChi}
                    onChange={(event) =>
                        setValues({
                            ...values,
                            soTinChi:
                            event.target.value,
                        })
                    }
                    style={{
                        width: '100%',
                        maxWidth: 500,
                        padding: 8,
                        boxSizing: 'border-box',
                    }}
                />

                {clientErrors.soTinChi && (
                    <p
                        style={{
                            color: '#b91c1c',
                            margin: '4px 0 0',
                        }}
                    >
                        {clientErrors.soTinChi}
                    </p>
                )}
            </div>

            <div
                style={{
                    marginBottom: 12,
                }}
            >
                <label htmlFor="soChoToiDa">
                    Số chỗ tối đa
                </label>
                <br />

                <input
                    id="soChoToiDa"
                    type="number"
                    min="1"
                    value={values.soChoToiDa}
                    onChange={(event) =>
                        setValues({
                            ...values,
                            soChoToiDa:
                            event.target.value,
                        })
                    }
                    style={{
                        width: '100%',
                        maxWidth: 500,
                        padding: 8,
                        boxSizing: 'border-box',
                    }}
                />

                {clientErrors.soChoToiDa && (
                    <p
                        style={{
                            color: '#b91c1c',
                            margin: '4px 0 0',
                        }}
                    >
                        {
                            clientErrors.soChoToiDa
                        }
                    </p>
                )}
            </div>

            {serverError && (
                <p
                    style={{
                        color: '#b91c1c',
                    }}
                >
                    {serverError}
                </p>
            )}

            <button
                type="submit"
                disabled={submitting}
            >
                {submitting
                    ? 'Đang lưu...'
                    : editingCourse
                        ? 'Cập nhật'
                        : 'Thêm mới'}
            </button>

            {editingCourse && (
                <button
                    type="button"
                    onClick={onCancel}
                    style={{
                        marginLeft: 8,
                    }}
                >
                    Hủy
                </button>
            )}
        </form>
    );
}