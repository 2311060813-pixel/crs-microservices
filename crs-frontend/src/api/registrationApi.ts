import axiosClient from './axiosClient';
import type {
    Registration,
    RegistrationRequest,
} from '../types/registration';

export const createRegistration = (data: RegistrationRequest) => {
    return axiosClient.post<Registration>('/api/registrations', data);
};

export const cancelRegistration = (id: number) => {
    return axiosClient.delete(`/api/registrations/${id}`);
};

export const getRegistrationsByStudent = (studentId: number) => {
    return axiosClient.get<Registration[]>(
        `/api/registrations/student/${studentId}`,
    );
};