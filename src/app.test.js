const request = require('supertest');
const app = require('./app');
const Product = require('./models/product');

describe('Product Routes', () => {
  beforeEach(() => {
    // Clear all products
    const products = Product.getAll();
    while (products.length > 0) {
      Product.delete(products[0].id);
    }
    
    // Create a test product
    Product.create({ 
      name: 'Test Product', 
      price: 100, 
      description: 'Test Description' 
    });
  });

  test('GET /products should return products page', async () => {
    const response = await request(app).get('/products');
    expect(response.status).toBe(200);
    expect(response.text).toContain('All Products');
    expect(response.text).toContain('Test Product');
  });

  test('GET /products/new should return new product form', async () => {
    const response = await request(app).get('/products/new');
    expect(response.status).toBe(200);
    expect(response.text).toContain('Add New Product');
    expect(response.text).toContain('<form action="/products" method="POST">');
  });

  test('POST /products should create a new product', async () => {
    const newProduct = {
      name: 'New Product',
      price: 200,
      description: 'New Description'
    };

    const response = await request(app)
      .post('/products')
      .type('form')
      .send(newProduct);

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe('/products');

    const products = Product.getAll();
    const createdProduct = products.find(p => p.name === newProduct.name);
    expect(createdProduct).toBeDefined();
    expect(createdProduct.price).toBe(newProduct.price);
  });

  test('GET /products/:id should return product details', async () => {
    const products = Product.getAll();
    const productId = products[0].id;
    
    const response = await request(app).get(`/products/${productId}`);
    expect(response.status).toBe(200);
    expect(response.text).toContain('Product Details');
    expect(response.text).toContain('Test Product');
  });

  test('GET /products/:id/edit should return edit form', async () => {
    const products = Product.getAll();
    const productId = products[0].id;
    
    const response = await request(app).get(`/products/${productId}/edit`);
    expect(response.status).toBe(200);
    expect(response.text).toContain('Edit Product');
    expect(response.text).toContain('Test Product');
  });

  test('POST /products/:id should update product', async () => {
    const products = Product.getAll();
    const productId = products[0].id;
    const updatedData = {
      name: 'Updated Product',
      price: 150,
      description: 'Updated Description'
    };

    const response = await request(app)
      .post(`/products/${productId}`)
      .type('form')
      .send(updatedData);

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe('/products');

    const updatedProduct = Product.getById(productId);
    expect(updatedProduct.name).toBe(updatedData.name);
    expect(updatedProduct.price).toBe(updatedData.price);
  });

  test('POST /products/:id/delete should delete product', async () => {
    const products = Product.getAll();
    const productId = products[0].id;
    const initialCount = products.length;

    const response = await request(app)
      .post(`/products/${productId}/delete`);

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe('/products');

    const remainingProducts = Product.getAll();
    expect(remainingProducts.length).toBe(initialCount - 1);
    expect(Product.getById(productId)).toBeUndefined();
  });
});
