const request = require('supertest');
const app = require('./app');
const Product = require('./models/product');

describe('Product Routes', () => {
  let server;
  let testProduct;

  beforeAll((done) => {
    server = app.listen(0, () => {
      console.log('Test server started');
      done();
    });
  });

  afterAll((done) => {
    if (server) {
      server.close(() => {
        console.log('Test server closed');
        done();
      });
    } else {
      done();
    }
  });

  beforeEach(() => {
    // Clear all products
    const products = Product.getAll();
    while (products.length > 0) {
      Product.delete(products[0].id);
    }
    
    // Create a test product
    testProduct = Product.create({ 
      name: 'Test Product', 
      price: 100, 
      description: 'Test Description' 
    });
  });

  describe('GET /products', () => {
    test('should return products page with all products', async () => {
      const response = await request(app).get('/products');
      expect(response.status).toBe(200);
      expect(response.text).toContain('All Products');
      expect(response.text).toContain('Test Product');
    });
  });

  describe('GET /products/new', () => {
    test('should return new product form', async () => {
      const response = await request(app).get('/products/new');
      expect(response.status).toBe(200);
      expect(response.text).toContain('Add New Product');
      expect(response.text).toContain('<form action="/products" method="POST">');
    });
  });

  describe('POST /products', () => {
    test('should create a new product and redirect', async () => {
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
  });

  describe('GET /products/:id', () => {
    test('should return product details page', async () => {
      const response = await request(app).get(`/products/${testProduct.id}`);
      expect(response.status).toBe(200);
      expect(response.text).toContain('Product Details');
      expect(response.text).toContain('Test Product');
    });

    test('should return 404 for non-existent product', async () => {
      const response = await request(app).get('/products/non-existent-id');
      expect(response.status).toBe(404);
      expect(response.text).toContain('Product not found');
    });
  });

  describe('GET /products/:id/edit', () => {
    test('should return edit form for existing product', async () => {
      const response = await request(app).get(`/products/${testProduct.id}/edit`);
      expect(response.status).toBe(200);
      expect(response.text).toContain('Edit Product');
      expect(response.text).toContain(testProduct.name);
    });

    test('should return 404 for non-existent product', async () => {
      const response = await request(app).get('/products/non-existent-id/edit');
      expect(response.status).toBe(404);
    });
  });

  describe('POST /products/:id', () => {
    test('should update product and redirect', async () => {
      const updatedData = {
        name: 'Updated Product',
        price: 150,
        description: 'Updated Description'
      };

      const response = await request(app)
        .post(`/products/${testProduct.id}`)
        .type('form')
        .send(updatedData);

      expect(response.status).toBe(302);
      expect(response.headers.location).toBe('/products');

      const updatedProduct = Product.getById(testProduct.id);
      expect(updatedProduct.name).toBe(updatedData.name);
      expect(updatedProduct.price).toBe(updatedData.price);
    });
  });

  describe('POST /products/:id/delete', () => {
    test('should delete product and redirect', async () => {
      const response = await request(app)
        .post(`/products/${testProduct.id}/delete`);

      expect(response.status).toBe(302);
      expect(response.headers.location).toBe('/products');

      const deletedProduct = Product.getById(testProduct.id);
      expect(deletedProduct).toBeUndefined();
    });
  });
});
