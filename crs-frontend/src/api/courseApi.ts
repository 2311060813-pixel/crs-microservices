import axiosClient from './axiosClient';
import type {
    Course,
    CourseFormValues,
} from '../types/course';

export interface PagedResponse<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
}

export const getCourses = (
    keyword = '',
    page = 0,
    size = 10,
) => {
    return axiosClient.get<PagedResponse<Course>>(
        '/api/courses',
        {
            params: {
                keyword,
                page,
                size,
            },
        },
    );
};

const toPayload = (
    data: CourseFormValues,
) => ({
    tenMonHoc: data.tenMonHoc.trim(),
    soTinChi: Number(data.soTinChi),
    soChoToiDa: Number(data.soChoToiDa),
});

export const createCourse = (
    data: CourseFormValues,
) => {
    return axiosClient.post<Course>(
        '/api/courses',
        toPayload(data),
    );
};

export const updateCourse = (
    id: number,
    data: CourseFormValues,
) => {
    return axiosClient.put<Course>(
        `/api/courses/${id}`,
        toPayload(data),
    );
};

export const deleteCourse = (
    id: number,
) => {
    return axiosClient.delete(
        `/api/courses/${id}`,
    );
};

// Lấy thông tin một môn học theo ID
export const getCourseById = (
    id: number,
) => {
    return axiosClient.get<Course>(
        `/api/courses/${id}`,
    );
};