import { useCallback, useState } from 'react';

import { useCourses } from '../api/useCourses';
import SearchBox from '../components/SearchBox';
import CourseList from '../components/CourseList';
import Pagination from '../components/Pagination';
import Navbar from '../components/Navbar';

export default function CoursesPage() {
    const [keyword, setKeyword] = useState('');
    const [page, setPage] = useState(0);

    const {
        courses,
        totalPages,
        state,
        errorMessage,
        refetch,
    } = useCourses(keyword, page);

    const handleSearch = useCallback(
        (newKeyword: string) => {
            setKeyword(newKeyword);
            setPage(0);
        },
        [],
    );

    return (
        <div
            style={{
                minHeight: '100vh',
                background: '#f5f7fb',
            }}
        >
            {/* THANH ĐIỀU HƯỚNG */}
            <Navbar />

            {/* NỘI DUNG */}
            <main
                style={{
                    padding: '24px',
                    maxWidth: '900px',
                    margin: '0 auto',
                    fontFamily: 'sans-serif',
                }}
            >
                <h1>Danh sách môn học</h1>

                <SearchBox
                    onSearch={handleSearch}
                />

                <div
                    style={{
                        marginTop: '16px',
                    }}
                >
                    <CourseList
                        courses={courses}
                        state={state}
                        errorMessage={errorMessage}
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