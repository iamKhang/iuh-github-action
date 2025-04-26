# Các Bước Demo CI/CD với GitHub Actions

Tài liệu này mô tả chi tiết các bước để thực hiện demo CI/CD sử dụng GitHub Actions trong dự án quản lý sản phẩm.

## Chuẩn Bị

1. **Đảm bảo đã push code lên GitHub**:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Kiểm tra các workflow đã được cấu hình**:
   - `.github/workflows/ci.yml`
   - `.github/workflows/cd.yml`

## Demo 1: Quy Trình CI - Phát Triển Tính Năng Mới

### Bước 1: Tạo Nhánh Tính Năng Mới

```bash
git checkout -b feature/product-search
```

### Bước 2: Thêm Chức Năng Tìm Kiếm Sản Phẩm

Thêm route tìm kiếm vào file `src/routes/products.js`:

```javascript
// Tìm kiếm sản phẩm
router.get('/search', (req, res) => {
  const query = req.query.q || '';
  const products = Product.getAll().filter(product => 
    product.name.toLowerCase().includes(query.toLowerCase()) ||
    product.description.toLowerCase().includes(query.toLowerCase())
  );
  res.render('products/search', { products, query });
});
```

Tạo file view `src/views/products/search.ejs`:

```html
<div class="container">
  <h2>Kết Quả Tìm Kiếm: "<%= query %>"</h2>
  
  <% if (products.length === 0) { %>
    <p>Không tìm thấy sản phẩm nào.</p>
  <% } else { %>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Tên</th>
          <th>Giá</th>
          <th>Thao Tác</th>
        </tr>
      </thead>
      <tbody>
        <% products.forEach(product => { %>
          <tr>
            <td><%= product.id %></td>
            <td><%= product.name %></td>
            <td>$<%= product.price.toFixed(2) %></td>
            <td>
              <a href="/products/<%= product.id %>">Xem</a>
              <a href="/products/<%= product.id %>/edit">Sửa</a>
              <form action="/products/<%= product.id %>/delete" method="POST" style="display: inline;">
                <button type="submit" onclick="return confirm('Bạn có chắc chắn?')">Xóa</button>
              </form>
            </td>
          </tr>
        <% }); %>
      </tbody>
    </table>
  <% } %>
  
  <div class="actions">
    <a href="/products" class="btn">Quay Lại</a>
  </div>
</div>
```

Thêm form tìm kiếm vào `src/views/products/index.ejs`:

```html
<div class="search-form">
  <form action="/products/search" method="GET">
    <input type="text" name="q" placeholder="Tìm kiếm sản phẩm...">
    <button type="submit" class="btn">Tìm Kiếm</button>
  </form>
</div>
```

### Bước 3: Thêm Bài Kiểm Thử

Thêm bài kiểm thử vào file `src/app.test.js`:

```javascript
test('GET /products/search should return search results', async () => {
  const response = await request(app)
    .get('/products/search')
    .query({ q: 'Test' });
  
  expect(response.status).toBe(200);
  expect(response.text).toContain('Kết Quả Tìm Kiếm');
  expect(response.text).toContain('Test Product 1');
});
```

### Bước 4: Commit và Push Thay Đổi

```bash
git add .
git commit -m "Add product search functionality"
git push origin feature/product-search
```

### Bước 5: Tạo Pull Request

1. Truy cập repository trên GitHub
2. Chọn "Pull requests" > "New pull request"
3. Chọn nhánh `feature/product-search` để so sánh với nhánh `main`
4. Điền thông tin PR và tạo

### Bước 6: Quan Sát CI Workflow

1. Truy cập tab "Actions" trên GitHub
2. Xem CI workflow đang chạy
3. Kiểm tra kết quả các bài kiểm thử

### Bước 7: Merge Pull Request

1. Sau khi CI workflow thành công, merge PR vào nhánh main
2. Quan sát CD workflow tự động chạy

## Demo 2: Quy Trình CD - Sửa Lỗi Khẩn Cấp

### Bước 1: Tạo Nhánh Hotfix

```bash
git checkout main
git pull
git checkout -b hotfix/product-deletion
```

### Bước 2: Sửa Lỗi

Giả sử có lỗi trong chức năng xóa sản phẩm. Sửa lỗi trong file `src/models/product.js`:

```javascript
static delete(id) {
  const index = products.findIndex(product => product.id === id);
  if (index !== -1) {
    const deletedProduct = products[index];
    products = products.filter(product => product.id !== id);
    return deletedProduct;
  }
  return null;
}
```

### Bước 3: Commit và Push Thay Đổi

```bash
git add .
git commit -m "Fix product deletion bug"
git push origin hotfix/product-deletion
```

### Bước 4: Tạo Pull Request

1. Truy cập repository trên GitHub
2. Tạo PR từ nhánh `hotfix/product-deletion` vào nhánh `main`

### Bước 5: Quan Sát CI Workflow

1. Xem CI workflow đang chạy
2. Kiểm tra kết quả các bài kiểm thử

### Bước 6: Merge Pull Request

1. Sau khi CI workflow thành công, merge PR vào nhánh main
2. Quan sát CD workflow tự động chạy

## Demo 3: Giám Sát và Phân Tích

### Bước 1: Xem Lịch Sử Workflow

1. Truy cập tab "Actions" trên GitHub
2. Xem lịch sử các workflow đã chạy

### Bước 2: Phân Tích Hiệu Suất

1. Kiểm tra thời gian chạy của mỗi workflow
2. Xác định các bước tốn nhiều thời gian nhất

### Bước 3: Kiểm Tra Logs

1. Chọn một workflow run cụ thể
2. Xem chi tiết logs của từng bước

### Bước 4: Tối Ưu Hóa Workflow

Dựa trên phân tích, bạn có thể tối ưu hóa workflow bằng cách:

1. Sử dụng cache hiệu quả hơn
2. Tối ưu hóa các bài kiểm thử
3. Chỉ chạy các bài kiểm thử liên quan đến thay đổi

## Kết Luận

Qua demo này, bạn đã thấy cách GitHub Actions tự động hóa quy trình CI/CD, giúp phát hiện lỗi sớm và triển khai nhanh chóng. Việc thiết lập CI/CD đúng cách giúp tăng chất lượng code và giảm thời gian phát triển.
