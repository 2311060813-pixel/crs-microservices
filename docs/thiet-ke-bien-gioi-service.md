\# Thiết kế biên giới Service



\## 1. Kiến trúc tổng thể



Hệ thống CRS Microservices được chia thành các service độc lập:



\- API Gateway

\- Auth Service

\- Course Service

\- Registration Service



Mỗi service chịu trách nhiệm cho một nhóm chức năng riêng và có database riêng.



\## 2. Các thành phần



\### API Gateway



\- Port: 8080

\- Không sử dụng database riêng

\- Là entry point của hệ thống

\- Định tuyến request đến các service tương ứng

\- Hỗ trợ basic authentication

\- Xử lý CORS



\### Auth Service



\- Port: 8081

\- Database: auth\_db

\- Quản lý User và Student

\- Xử lý chức năng đăng nhập

\- Cung cấp JWT



\### Course Service



\- Port: 8082

\- Database: course\_db

\- Quản lý thông tin Course

\- Tìm kiếm khóa học

\- Phân trang

\- Quản lý số lượng chỗ học



\### Registration Service



\- Port: 8083

\- Database: registration\_db

\- Quản lý Registration

\- Gọi Course Service khi đăng ký khóa học

\- Thực hiện các nghiệp vụ liên quan đến đăng ký học



\## 3. Nguyên tắc phân tách Database



Mỗi service sử dụng một database riêng:



| Service | Database |

|---|---|

| Auth Service | auth\_db |

| Course Service | course\_db |

| Registration Service | registration\_db |



Các service không truy cập trực tiếp database của service khác.



\## 4. Định tuyến qua API Gateway



| Request | Service |

|---|---|

| /auth/\*\* | Auth Service |

| /courses/\*\* | Course Service |

| /registrations/\*\* | Registration Service |



API Gateway hoạt động tại port 8080 và chuyển tiếp request đến service tương ứng.

