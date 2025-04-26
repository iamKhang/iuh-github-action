const Product = require('./product');

describe('Product Model', () => {
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

  test('should get all products', () => {
    const products = Product.getAll();
    expect(products.length).toBe(2);
    expect(products[0].name).toBe('Test Product 1');
    expect(products[1].name).toBe('Test Product 2');
  });

  test('should get product by id', () => {
    const products = Product.getAll();
    const productId = products[0].id;
    
    const product = Product.getById(productId);
    expect(product).toBeDefined();
    expect(product.name).toBe('Test Product 1');
    expect(product.price).toBe(100);
  });

  test('should create a new product', () => {
    const newProduct = Product.create({
      name: 'New Product',
      price: 300,
      description: 'New Description'
    });
    
    expect(newProduct).toBeDefined();
    expect(newProduct.id).toBeDefined();
    expect(newProduct.name).toBe('New Product');
    
    const products = Product.getAll();
    expect(products.length).toBe(3);
  });

  test('should update a product', () => {
    const products = Product.getAll();
    const productId = products[0].id;
    
    const updatedProduct = Product.update(productId, {
      name: 'Updated Product',
      price: 150,
      description: 'Updated Description'
    });
    
    expect(updatedProduct).toBeDefined();
    expect(updatedProduct.name).toBe('Updated Product');
    expect(updatedProduct.price).toBe(150);
    
    const product = Product.getById(productId);
    expect(product.name).toBe('Updated Product');
  });

  test('should delete a product', () => {
    const products = Product.getAll();
    const initialCount = products.length;
    const productId = products[0].id;
    
    const deletedProduct = Product.delete(productId);
    expect(deletedProduct).toBeDefined();
    expect(deletedProduct.id).toBe(productId);
    
    const updatedProducts = Product.getAll();
    expect(updatedProducts.length).toBe(initialCount - 1);
    
    const product = Product.getById(productId);
    expect(product).toBeUndefined();
  });
});
