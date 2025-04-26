const request = require('supertest');
const app = require('./app');
const Product = require('./models/product');

describe('Product API Routes', () => {
  // Reset products before each test
  beforeEach(() => {
    // Access the private products array and reset it
    const originalProducts = Product.getAll();
    while (originalProducts.length > 0) {
      Product.delete(originalProducts[0].id);
    }
    
    // Add test products
    Product.create({ name: 'Test Product 1', price: 100, description: 'Test Description 1' });
    Product.create({ name: 'Test Product 2', price: 200, description: 'Test Description 2' });
  });

  test('GET /products should return products page', async () => {
    const response = await request(app).get('/products');
    expect(response.status).toBe(200);
    expect(response.text).toContain('All Products');
    expect(response.text).toContain('Test Product 1');
    expect(response.text).toContain('Test Product 2');
  });

  test('GET /products/new should return new product form', async () => {
    const response = await request(app).get('/products/new');
    expect(response.status).toBe(200);
    expect(response.text).toContain('Add New Product');
    expect(response.text).toContain('<form action="/products" method="POST">');
  });

  test('POST /products should create a new product', async () => {
    const initialProducts = Product.getAll();
    const initialCount = initialProducts.length;
    
    const response = await request(app)
      .post('/products')
      .type('form')
      .send({
        name: 'New Test Product',
        price: 300,
        description: 'New Test Description'
      });
    
    expect(response.status).toBe(302); // Redirect
    expect(response.headers.location).toBe('/products');
    
    const updatedProducts = Product.getAll();
    expect(updatedProducts.length).toBe(initialCount + 1);
    
    const newProduct = updatedProducts.find(p => p.name === 'New Test Product');
    expect(newProduct).toBeDefined();
    expect(newProduct.price).toBe(300);
  });

  test('GET /products/:id should return product details', async () => {
    const products = Product.getAll();
    const productId = products[0].id;
    
    const response = await request(app).get(`/products/${productId}`);
    expect(response.status).toBe(200);
    expect(response.text).toContain('Product Details');
    expect(response.text).toContain('Test Product 1');
    expect(response.text).toContain('Test Description 1');
  });
});
