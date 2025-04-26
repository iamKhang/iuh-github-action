// Simple in-memory product model
let products = [
  {
    id: '1',
    name: 'Laptop',
    price: 1200,
    description: 'High-performance laptop with 16GB RAM'
  },
  {
    id: '2',
    name: 'Smartphone',
    price: 800,
    description: 'Latest model with 128GB storage'
  },
  {
    id: '3',
    name: 'Headphones',
    price: 150,
    description: 'Noise-cancelling wireless headphones'
  }
];

class Product {
  static getAll() {
    return products;
  }

  static getById(id) {
    return products.find(product => product.id === id);
  }

  static create(productData) {
    const newProduct = {
      id: Date.now().toString(),
      name: productData.name,
      price: parseFloat(productData.price),
      description: productData.description
    };
    products.push(newProduct);
    return newProduct;
  }

  static update(id, productData) {
    const index = products.findIndex(product => product.id === id);
    if (index !== -1) {
      products[index] = {
        ...products[index],
        name: productData.name,
        price: parseFloat(productData.price),
        description: productData.description
      };
      return products[index];
    }
    return null;
  }

  static delete(id) {
    const index = products.findIndex(product => product.id === id);
    if (index !== -1) {
      const deletedProduct = products[index];
      products = products.filter(product => product.id !== id);
      return deletedProduct;
    }
    return null;
  }
}

module.exports = Product;
