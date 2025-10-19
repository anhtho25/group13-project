# group13-project: https://github.com/anhtho25/group13-project.git

**Phân công vai trò**

- Trưởng nhóm: Nguyễn Trần Anh Thơ — Backend (Node.js + Express)
- Thành viên: Huỳnh Lê Như Quỳnh — Database (MongoDB)
- Thành viên: Nguyễn Thị Huỳnh Như — Frontend (React)

Nhóm 13 – Ứng dụng Web Quản Lý Người Dùng (CRUD MERN)
Dự án này được thực hiện bởi nhóm 13 trong học phần Phát triển phần mềm mã nguồn mở, với mục tiêu xây dựng một ứng dụng web quản lý người dùng có đầy đủ chức năng CRUD (Create – Read – Update – Delete). Ứng dụng được phát triển dựa trên MERN Stack gồm: MongoDB cho cơ sở dữ liệu, Express.js và Node.js cho backend, cùng React.js cho giao diện frontend.
Ứng dụng cho phép người dùng thêm mới thông tin (POST), xem danh sách người dùng (GET), chỉnh sửa thông tin (PUT) và xóa người dùng (DELETE). Các thao tác đều được kết nối trực tiếp đến MongoDB Atlas thông qua API Node.js/Express, đảm bảo dữ liệu được lưu trữ và cập nhật tự động.
Phần backend được xây dựng bằng Node.js và Express, chịu trách nhiệm khởi tạo server, kết nối MongoDB qua Mongoose, và định nghĩa các API /api/users cho các thao tác CRUD. Phần frontend sử dụng React.js, với các component chính là AddUser.jsx (thêm người dùng mới) và UserList.jsx (hiển thị, sửa, xóa người dùng). Dữ liệu được quản lý bằng useState, useEffect, và được gọi thông qua Axios. Ứng dụng cũng có phần validation giúp kiểm tra dữ liệu đầu vào (tên và email hợp lệ) trước khi gửi lên server.
Phần cơ sở dữ liệu (MongoDB Atlas) do sinh viên 3 phụ trách, bao gồm việc khởi tạo cluster, tạo collection users, và cung cấp URI kết nối cho backend sử dụng trong file .env. Dữ liệu được định nghĩa trong mô hình User.js với các trường name, email, createdAt, giúp đồng bộ thông tin với frontend và backend.
Về quy trình phát triển, nhóm làm việc theo mô hình phân nhánh Git, mỗi sinh viên đảm nhiệm một nhánh riêng biệt (backend, frontend, database) để phát triển phần của mình. Khi hoàn thành, các thành viên tạo Pull Request (PR) và hợp nhất (merge) vào nhánh chính main. Trong quá trình làm việc, nhóm đã áp dụng các kỹ năng Git nâng cao như xử lý xung đột (merge conflict), rebase, và squash commit để chuẩn hóa lịch sử mã nguồn.

Để chạy dự án, cần thực hiện các bước sau:
Clone repository về máy.
Di chuyển vào thư mục backend, chạy npm install để cài đặt dependencies, sau đó khởi động server bằng node server.js (server chạy ở http://localhost:3000).
Mở thư mục frontend, chạy npm install và npm start để khởi động giao diện (frontend chạy ở http://localhost:3003).
Toàn bộ dữ liệu được lưu trữ và truy xuất từ MongoDB Atlas qua đường kết nối trong file .env.

Dự án đã được kiểm thử đầy đủ bằng Postman, với bốn API hoạt động chính xác:
GET /api/users – Lấy danh sách người dùng.
POST /api/users – Thêm người dùng mới.
PUT /api/users/:id – Cập nhật thông tin người dùng.
DELETE /api/users/:id – Xóa người dùng khỏi hệ thống.

Phân công công việc
Sinh viên 1 (Nhóm trưởng) – Phụ trách Backend: Xây dựng API bằng Node.js + Express, kết nối MongoDB, xử lý CRUD và CORS.
Sinh viên 2 – Phụ trách Frontend (React): Thiết kế giao diện, quản lý state, thêm chức năng validation, gọi API và hiển thị dữ liệu.
Sinh viên 3 – Phụ trách Cơ sở dữ liệu (MongoDB): Cấu hình MongoDB Atlas, cung cấp URI kết nối và kiểm tra dữ liệu lưu trữ.
