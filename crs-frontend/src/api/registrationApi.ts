import axiosClient from './axiosClient';

import type {
    Registration,
    RegistrationRequest,
} from '../types/registration';

// Đăng ký học phần
export const registerCourse = (
    payload: RegistrationRequest,
) => {
    return axiosClient.post<Registration>(
        '/api/registrations',
        payload,
    );
};

// Hủy đăng ký
export const cancelRegistration = (
    id: number,
) => {
    return axiosClient.delete(
        `/api/registrations/${id}`,
    );
};

// Lấy danh sách môn học của chính sinh viên đang đăng nhập
export const getMyRegistrations = () => {
    return axiosClient.get<Registration[]>(
        '/api/registrations/my',
    );
};