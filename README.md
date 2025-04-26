# Hệ Thống Quản Lý Sản Phẩm với GitHub Actions

Ứng dụng web quản lý sản phẩm đơn giản được xây dựng bằng Express.js và được cấu hình với GitHub Actions để thực hiện CI/CD.

## Tính Năng

- Xem tất cả sản phẩm
- Thêm sản phẩm mới
- Chỉnh sửa sản phẩm hiện có
- Xóa sản phẩm
- Thiết kế responsive

## Công Nghệ Sử Dụng

- Node.js
- Express.js
- EJS (Embedded JavaScript templates)
- CSS
- GitHub Actions cho CI/CD

## Bắt Đầu

### Yêu Cầu Hệ Thống

- Node.js (v18 trở lên)
- npm

### Cài Đặt

1. Clone repository:
   ```
   git clone https://github.com/iamKhang/iuh-github-action.git
   cd iuh-github-action
   ```

2. Cài đặt các gói phụ thuộc:
   ```
   npm install
   ```

3. Khởi động máy chủ phát triển:
   ```
   npm run dev
   ```

4. Mở trình duyệt và truy cập `http://localhost:3000`

## Kiểm Thử

Chạy các bài kiểm thử với lệnh:
```
npm test
```

## Quy Trình CI/CD

Dự án này sử dụng GitHub Actions cho tích hợp liên tục và triển khai liên tục:

- **Quy Trình CI**: Chạy kiểm thử trên mỗi lần push và pull request đến nhánh main
- **Quy Trình CD**: Xây dựng và triển khai ứng dụng khi có thay đổi được push đến nhánh main

## Cấu Trúc Dự Án

```
.
├── .github/workflows    # Tệp cấu hình GitHub Actions
├── src/                 # Mã nguồn
│   ├── models/          # Mô hình dữ liệu
│   ├── public/          # Tài nguyên tĩnh
│   ├── routes/          # Xử lý định tuyến
│   ├── views/           # Mẫu EJS
│   └── app.js           # Tệp ứng dụng chính
├── package.json         # Phụ thuộc và script dự án
└── README.md            # Tài liệu dự án
```

## Mô Tả Cách Hoạt Động

Ứng dụng này là một hệ thống quản lý sản phẩm đơn giản cho phép người dùng thực hiện các thao tác CRUD (Create, Read, Update, Delete) đối với sản phẩm. Dữ liệu sản phẩm được lưu trữ trong bộ nhớ (in-memory) để đơn giản hóa việc triển khai.

### Luồng Hoạt Động:

1. **Trang Chủ**: Hiển thị danh sách tất cả sản phẩm với các tùy chọn để xem chi tiết, chỉnh sửa hoặc xóa.
2. **Thêm Sản Phẩm**: Người dùng có thể thêm sản phẩm mới bằng cách điền thông tin vào biểu mẫu.
3. **Xem Chi Tiết**: Hiển thị thông tin chi tiết của một sản phẩm cụ thể.
4. **Chỉnh Sửa Sản Phẩm**: Cho phép người dùng cập nhật thông tin của sản phẩm hiện có.
5. **Xóa Sản Phẩm**: Xóa sản phẩm khỏi hệ thống.

### Quy Trình CI/CD:

- Mỗi khi có thay đổi được push lên GitHub, GitHub Actions sẽ tự động chạy các bài kiểm thử để đảm bảo ứng dụng hoạt động đúng.
- Nếu tất cả các bài kiểm thử đều thành công và thay đổi được merge vào nhánh main, quy trình CD sẽ tự động triển khai ứng dụng.

## Tình Huống Demo CI/CD

Dự án này được thiết kế để minh họa quy trình CI/CD sử dụng GitHub Actions. Ứng dụng web quản lý sản phẩm đơn giản được sử dụng làm ví dụ thực tế để triển khai quy trình này.

### Kịch Bản 1: Phát Triển Tính Năng Mới

Trong kịch bản này, chúng ta mô phỏng quy trình phát triển và triển khai một tính năng mới:

1. **Tạo Nhánh Tính Năng**:
   ```bash
   git checkout -b feature/add-product-search
   ```

2. **Phát Triển Tính Năng**: Thêm chức năng tìm kiếm sản phẩm vào ứng dụng.

3. **Commit Thay Đổi**:
   ```bash
   git add .
   git commit -m "Add product search functionality"
   ```

4. **Push Lên GitHub**:
   ```bash
   git push origin feature/add-product-search
   ```

5. **Tự Động Kiểm Thử**: GitHub Actions tự động chạy các bài kiểm thử khi có push lên nhánh tính năng.

6. **Tạo Pull Request**: Tạo PR để merge tính năng vào nhánh main.

7. **Kiểm Tra CI**: GitHub Actions chạy kiểm thử trên PR để đảm bảo không có lỗi.

8. **Merge và Triển Khai**: Sau khi PR được chấp nhận và merge vào main, GitHub Actions tự động triển khai phiên bản mới.

### Kịch Bản 2: Sửa Lỗi Khẩn Cấp

Trong kịch bản này, chúng ta mô phỏng quy trình sửa lỗi và triển khai nhanh:

1. **Tạo Nhánh Hotfix**:
   ```bash
   git checkout -b hotfix/fix-product-deletion
   ```

2. **Sửa Lỗi**: Sửa lỗi trong chức năng xóa sản phẩm.

3. **Commit Thay Đổi**:
   ```bash
   git add .
   git commit -m "Fix product deletion bug"
   ```

4. **Push Lên GitHub**:
   ```bash
   git push origin hotfix/fix-product-deletion
   ```

5. **Tự Động Kiểm Thử**: GitHub Actions tự động chạy các bài kiểm thử.

6. **Tạo Pull Request**: Tạo PR để merge hotfix vào nhánh main.

7. **Kiểm Tra CI và Merge**: Sau khi kiểm thử thành công, merge PR vào main.

8. **Tự Động Triển Khai**: GitHub Actions tự động triển khai phiên bản đã sửa lỗi.

### Kịch Bản 3: Triển Khai Liên Tục

Mô phỏng quy trình phát triển liên tục với nhiều thành viên trong nhóm:

1. **Nhiều Nhánh Tính Năng**: Các thành viên làm việc trên các nhánh tính năng khác nhau.

2. **Tích Hợp Liên Tục**: Các PR được tạo và merge thường xuyên vào nhánh main.

3. **Kiểm Thử Tự Động**: Mỗi PR đều được kiểm thử tự động trước khi merge.

4. **Triển Khai Tự Động**: Sau mỗi lần merge thành công vào main, phiên bản mới được triển khai tự động.

5. **Giám Sát Liên Tục**: Theo dõi các bản dựng và triển khai thông qua giao diện GitHub Actions.

### Lợi Ích Của CI/CD Trong Dự Án

- **Tự Động Hóa Quy Trình**: Giảm thiểu công việc thủ công trong việc kiểm thử và triển khai.
- **Phát Hiện Lỗi Sớm**: Các lỗi được phát hiện ngay khi code được push lên, trước khi đến môi trường production.
- **Triển Khai Nhanh Chóng**: Các tính năng mới và bản sửa lỗi được triển khai nhanh chóng và an toàn.
- **Nhất Quán Giữa Môi Trường**: Đảm bảo ứng dụng hoạt động nhất quán giữa các môi trường phát triển, kiểm thử và production.
- **Lịch Sử Triển Khai**: Theo dõi dễ dàng lịch sử các bản dựng và triển khai thông qua GitHub Actions.

## Giấy Phép

Dự án này được cấp phép theo Giấy phép ISC.