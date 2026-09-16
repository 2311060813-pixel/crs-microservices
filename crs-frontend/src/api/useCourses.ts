import {
    useCallback,
    useEffect,
    useReducer,
} from 'react';
import axios from 'axios';
import { getCourses } from './courseApi';
import type { Course } from '../types/course';
import type { ApiErrorResponse } from '../types/apiError';

export type LoadState =
    | 'loading'
    | 'success'
    | 'empty'
    | 'error';

interface CoursesState {
    courses: Course[];
    totalPages: number;
    state: LoadState;
    errorMessage: string;
}

type Action =
    | {
    type: 'LOADING';
}
    | {
    type: 'SUCCESS';
    courses: Course[];
    totalPages: number;
}
    | {
    type: 'ERROR';
    message: string;
};

const initialState: CoursesState = {
    courses: [],
    totalPages: 0,
    state: 'loading',
    errorMessage: '',
};

function reducer(
    state: CoursesState,
    action: Action,
): CoursesState {
    switch (action.type) {
        case 'LOADING':
            return {
                ...state,
                state: 'loading',
                errorMessage: '',
            };

        case 'SUCCESS':
            return {
                courses: action.courses,
                totalPages: action.totalPages,
                state:
                    action.courses.length === 0
                        ? 'empty'
                        : 'success',
                errorMessage: '',
            };

        case 'ERROR':
            return {
                ...state,
                state: 'error',
                errorMessage: action.message,
            };

        default:
            return state;
    }
}

export function useCourses(
    keyword: string,
    page: number,
    size = 10,
) {
    const [state, dispatch] =
        useReducer(reducer, initialState);

    const fetchCourses = useCallback(
        async (): Promise<void> => {
            dispatch({
                type: 'LOADING',
            });

            try {
                const response =
                    await getCourses(
                        keyword,
                        page,
                        size,
                    );

                const data = response.data;

                dispatch({
                    type: 'SUCCESS',
                    courses: data.content,
                    totalPages: data.totalPages,
                });
            } catch (err: unknown) {
                let message =
                    'Đã xảy ra lỗi không xác định, vui lòng thử lại.';

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
                    } else if (!err.response) {
                        message =
                            'Không kết nối được tới hệ thống. Vui lòng thử lại sau.';
                    }
                }

                dispatch({
                    type: 'ERROR',
                    message,
                });
            }
        },
        [keyword, page, size],
    );

    useEffect(() => {
        void fetchCourses();
    }, [fetchCourses]);

    return {
        courses: state.courses,
        totalPages: state.totalPages,
        state: state.state,
        errorMessage: state.errorMessage,
        refetch: fetchCourses,
    };
}