# Hướng Dẫn Thiết Lập GitHub Actions

Tài liệu này cung cấp hướng dẫn chi tiết về cách thiết lập GitHub Actions cho dự án của bạn.

## GitHub Actions là gì?

GitHub Actions là một nền tảng tích hợp liên tục và triển khai liên tục (CI/CD) được tích hợp trực tiếp vào GitHub. Nó cho phép bạn tự động hóa quy trình xây dựng, kiểm thử và triển khai code.

## Cấu Trúc Cơ Bản

GitHub Actions sử dụng các file YAML để cấu hình workflow. Các file này được lưu trữ trong thư mục `.github/workflows` của repository.

### Thành Phần Chính

1. **Workflow**: Quy trình tự động được cấu hình trong file YAML.
2. **Event**: Sự kiện kích hoạt workflow (ví dụ: push, pull request).
3. **Job**: Một tập hợp các bước (steps) chạy trên cùng một runner.
4. **Step**: Một tác vụ riêng lẻ có thể chạy lệnh hoặc action.
5. **Action**: Ứng dụng tùy chỉnh cho nền tảng GitHub Actions.
6. **Runner**: Máy chủ chạy workflow.

## Thiết Lập Workflow CI

### Bước 1: Tạo Thư Mục Workflow

```bash
mkdir -p .github/workflows
```

### Bước 2: Tạo File CI Workflow

Tạo file `.github/workflows/ci.yml` với nội dung:

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

- **name**: Tên của workflow.
- **on**: Xác định khi nào workflow được kích hoạt.
- **jobs**: Danh sách các job sẽ chạy.
- **runs-on**: Hệ điều hành để chạy job.
- **strategy.matrix**: Cho phép chạy job với nhiều cấu hình khác nhau.
- **steps**: Danh sách các bước thực hiện trong job.

## Thiết Lập Workflow CD

### Bước 1: Tạo File CD Workflow

Tạo file `.github/workflows/cd.yml` với nội dung:

```yaml
name: CD

on:
  push:
    branches: [ main ]

jobs:
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
        # Thêm các bước build nếu cần

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
    
    # Đây là placeholder cho việc triển khai thực tế
    - name: Deploy
      run: |
        echo "Deploying application..."
        # Các lệnh triển khai sẽ được thêm vào đây
```

### Giải Thích:

- **needs**: Xác định job phụ thuộc vào job khác (job deploy phụ thuộc vào job build).

## Sử Dụng Secrets

GitHub Actions cho phép bạn sử dụng secrets để lưu trữ thông tin nhạy cảm.

### Bước 1: Thêm Secret vào Repository

1. Truy cập repository trên GitHub
2. Chọn "Settings" > "Secrets and variables" > "Actions"
3. Chọn "New repository secret"
4. Nhập tên và giá trị của secret

### Bước 2: Sử Dụng Secret trong Workflow

```yaml
steps:
  - name: Deploy to server
    run: |
      echo "Deploying to server..."
      # Sử dụng secret
    env:
      SERVER_PASSWORD: ${{ secrets.SERVER_PASSWORD }}
```

## Tùy Chỉnh Workflow

### Chạy Workflow Theo Lịch

```yaml
on:
  schedule:
    - cron: '0 0 * * *'  # Chạy vào 00:00 UTC hàng ngày
```

### Chạy Workflow Thủ Công

```yaml
on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment to deploy to'
        required: true
        default: 'staging'
```

### Sử Dụng Cache

```yaml
- name: Cache node modules
  uses: actions/cache@v3
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-
```

## Các Mẫu Workflow Phổ Biến

### Node.js Application

```yaml
name: Node.js CI/CD

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-test:
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
    
    - name: Lint
      run: npm run lint
    
    - name: Test
      run: npm test
    
    - name: Build
      run: npm run build
```

### Triển Khai lên Heroku

```yaml
name: Deploy to Heroku

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Deploy to Heroku
      uses: akhileshns/heroku-deploy@v3.12.14
      with:
        heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
        heroku_app_name: "your-app-name"
        heroku_email: "your-email@example.com"
```

## Xử Lý Lỗi Phổ Biến

### Workflow Không Kích Hoạt

- Kiểm tra cấu hình `on` trong file workflow
- Đảm bảo file workflow nằm trong thư mục `.github/workflows`
- Kiểm tra quyền của repository

### Job Thất Bại

- Kiểm tra logs để xác định lỗi
- Đảm bảo các phụ thuộc được cài đặt đúng
- Kiểm tra các biến môi trường và secrets

## Kết Luận

GitHub Actions là một công cụ mạnh mẽ để tự động hóa quy trình CI/CD. Bằng cách thiết lập đúng cách, bạn có thể tiết kiệm thời gian và tăng chất lượng code của mình.

## Tài Nguyên Bổ Sung

- [Tài liệu chính thức GitHub Actions](https://docs.github.com/en/actions)
- [GitHub Actions Marketplace](https://github.com/marketplace?type=actions)
- [GitHub Actions Community Forum](https://github.community/c/actions/41)
