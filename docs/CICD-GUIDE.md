# Hướng Dẫn CI/CD với GitHub Actions

Tài liệu này mô tả chi tiết cách thiết lập và sử dụng CI/CD với GitHub Actions trong dự án quản lý sản phẩm.

## Giới Thiệu

CI/CD (Continuous Integration/Continuous Deployment) là một phương pháp phát triển phần mềm hiện đại giúp tự động hóa quy trình kiểm thử và triển khai ứng dụng. Trong dự án này, chúng ta sử dụng GitHub Actions để thực hiện CI/CD.

## Cấu Trúc Workflow

Dự án này có hai workflow chính:

1. **CI Workflow** (`.github/workflows/ci.yml`): Chạy kiểm thử tự động khi có push hoặc pull request đến nhánh main.
2. **CD Workflow** (`.github/workflows/cd.yml`): Xây dựng và triển khai ứng dụng khi có thay đổi được push đến nhánh main.

## Chi Tiết CI Workflow

File cấu hình: `.github/workflows/ci.yml`

```yaml
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18.x, 20.x]

    steps:
    - uses: actions/checkout@v3
    
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
```

### Giải Thích:

- **Trigger**: Workflow được kích hoạt khi có push hoặc pull request đến nhánh main.
- **Jobs**: Chạy job "test" trên môi trường Ubuntu mới nhất.
- **Strategy Matrix**: Kiểm thử trên nhiều phiên bản Node.js (18.x và 20.x).
- **Steps**:
  1. Checkout code từ repository
  2. Thiết lập Node.js với phiên bản được chỉ định
  3. Cài đặt các phụ thuộc
  4. Chạy các bài kiểm thử

## Chi Tiết CD Workflow

File cấu hình: `.github/workflows/cd.yml`

```yaml
name: CD

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    needs: build
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Use Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '20.x'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    # Placeholder for actual deployment
    - name: Deploy
      run: |
        echo "Deploying application..."
        # Example deployment commands would go here

  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Use Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '20.x'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: |
        echo "Building application..."
        # Add build steps if needed
```

### Giải Thích:

- **Trigger**: Workflow chỉ được kích hoạt khi có push đến nhánh main.
- **Jobs**:
  - **build**: Xây dựng ứng dụng
  - **deploy**: Triển khai ứng dụng (phụ thuộc vào job build)
- **Steps**:
  1. Checkout code từ repository
  2. Thiết lập Node.js
  3. Cài đặt các phụ thuộc
  4. Chạy các bài kiểm thử
  5. Xây dựng ứng dụng
  6. Triển khai ứng dụng (hiện tại là placeholder)

## Hướng Dẫn Sử Dụng

### 1. Phát Triển Tính Năng Mới

```bash
# Tạo nhánh tính năng mới
git checkout -b feature/ten-tinh-nang

# Phát triển tính năng...

# Commit thay đổi
git add .
git commit -m "Mô tả tính năng mới"

# Push lên GitHub
git push origin feature/ten-tinh-nang
```

Sau khi push, GitHub Actions sẽ tự động chạy CI workflow để kiểm thử code của bạn.

### 2. Tạo Pull Request

1. Truy cập repository trên GitHub
2. Chọn "Pull requests" > "New pull request"
3. Chọn nhánh tính năng của bạn để so sánh với nhánh main
4. Điền thông tin PR và tạo

GitHub Actions sẽ chạy CI workflow trên PR của bạn. Bạn có thể xem kết quả kiểm thử trong tab "Checks" của PR.

### 3. Merge Pull Request

Sau khi PR được chấp nhận và merge vào nhánh main, GitHub Actions sẽ tự động chạy CD workflow để triển khai phiên bản mới của ứng dụng.

## Tùy Chỉnh Workflow

### Thêm Bước Kiểm Thử Khác

Bạn có thể thêm các bước kiểm thử khác vào CI workflow, ví dụ:

```yaml
- name: Lint code
  run: npm run lint

- name: Check code style
  run: npm run format:check
```

### Cấu Hình Triển Khai Thực Tế

Để triển khai ứng dụng lên một nền tảng thực tế, bạn cần cập nhật bước "Deploy" trong CD workflow. Ví dụ, để triển khai lên Heroku:

```yaml
- name: Deploy to Heroku
  uses: akhileshns/heroku-deploy@v3.12.14
  with:
    heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
    heroku_app_name: "ten-ung-dung-cua-ban"
    heroku_email: "email-cua-ban@example.com"
```

Lưu ý: Bạn cần thêm `HEROKU_API_KEY` vào Secrets của repository.

## Xử Lý Lỗi Phổ Biến

### Lỗi Kiểm Thử

Nếu CI workflow thất bại do lỗi kiểm thử:

1. Kiểm tra log lỗi trong tab "Actions" trên GitHub
2. Sửa lỗi trong code
3. Commit và push lại
4. CI workflow sẽ tự động chạy lại

### Lỗi Triển Khai

Nếu CD workflow thất bại:

1. Kiểm tra log lỗi trong tab "Actions"
2. Đảm bảo các biến môi trường và secrets đã được cấu hình đúng
3. Sửa lỗi và push lại nhánh main

## Kết Luận

CI/CD với GitHub Actions giúp tự động hóa quy trình phát triển và triển khai, giảm thiểu lỗi và tăng tốc độ phát hành. Bằng cách tuân theo hướng dẫn này, bạn có thể tận dụng tối đa lợi ích của CI/CD trong dự án của mình.
