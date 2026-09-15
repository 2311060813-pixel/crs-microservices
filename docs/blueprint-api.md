\# Blueprint API



\## 1. Auth Service



Base URL:



http://localhost:8081



\### Đăng nhập



POST /auth/login



Chức năng: Đăng nhập và nhận JWT.



\---



\## 2. Course Service



Base URL:



http://localhost:8082



\### Lấy danh sách môn học



GET /courses



Chức năng: Lấy danh sách các môn học.



\### Lấy thông tin một môn học



GET /courses/{id}



Chức năng: Lấy thông tin môn học theo ID.



\### Tạo môn học



POST /courses



Chức năng: Tạo môn học mới.



\### Cập nhật môn học



PUT /courses/{id}



Chức năng: Cập nhật thông tin môn học.



\### Xóa môn học



DELETE /courses/{id}



Chức năng: Xóa môn học.



\### Reserve seat



PATCH /internal/courses/{id}/reserve-seat



Chức năng: Giảm số chỗ còn lại khi có đăng ký.



\### Release seat



PATCH /internal/courses/{id}/release-seat



Chức năng: Tăng số chỗ còn lại khi hủy đăng ký.



\---



\## 3. Registration Service



Base URL:



http://localhost:8083



\### Đăng ký môn học



POST /registrations



Chức năng: Tạo đăng ký môn học.



\### Lấy danh sách đăng ký



GET /registrations



Chức năng: Lấy danh sách đăng ký.



\### Lấy đăng ký theo ID



GET /registrations/{id}



Chức năng: Lấy thông tin đăng ký theo ID.



\### Hủy đăng ký



DELETE /registrations/{id}



Chức năng: Hủy đăng ký môn học.



\---



\## 4. Internal API



Registration Service gọi Course Service để kiểm tra và cập nhật số chỗ.



\### Reserve seat



PATCH /internal/courses/{id}/reserve-seat



\### Release seat



PATCH /internal/courses/{id}/release-seat

