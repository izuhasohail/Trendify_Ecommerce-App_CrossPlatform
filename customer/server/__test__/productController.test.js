const request = require('supertest');
const app = require('../server');

describe('Product Routes', () => {
  let product;
  //getAllProducts test case scenarios
  it('should get all products', async () => {
    const response = await request(app).get('/api/products/');

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  //addProduct test case scenarios  
  it('should add a product', async () => {
    const newProduct = {
      productName: 'New Test Product',
      description: 'This is a new test product',
      images: ['new_image1.jpg', 'new_image2.jpg'],
      stock: 15,
      price: 75,
      expense: 50,
      isStitched: true,
      category: 'Men',
      piece: 2,
      fabric: 'Silk',
    };

    const response = await request(app)
      .post('/api/products/upload')
      .send(newProduct);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('_id');
    product=response.body._id;
  });

  it('should handle adding a product with missing fields', async () => {
    const invalidProduct = {
      productName: 'New Test Product',
      description: 'This is a new test product'
    };

    const response = await request(app)
      .post('/api/products/upload')
      .send(invalidProduct);

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  //getProduct test case scenarios
  it('should get a single product', async () => {
    const response = await request(app).get(`/api/products/${product}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('_id', product);
  });

  it('should handle invalid product ID', async () => {
    const invalidProductId = 'invalid_product_id';
    const response = await request(app).get(`/api/products/${invalidProductId}`);
    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('error', 'No such product');
  });

  it('should handle getting a non-existent product', async () => {
    const nonExistentProductId = '669d858cc2c8b444f608a21d';
    const response = await request(app).get(`/api/products/${nonExistentProductId}`);

    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('error', 'No such product');
  });

  //updateProduct test case scenarios
  it('should update a product', async () => {
    const updatedProduct = {
      productName: 'Updated Test Product',
    };

    const response = await request(app)
      .patch(`/api/products/${product}`)
      .send(updatedProduct);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('_id', product);
  });

  it('should handle updating a non-existent product', async () => {
    const nonExistentProductId = '669d858cc2c8b444f608a21d';

    const response = await request(app)
      .patch(`/api/products/${nonExistentProductId}`)
      .send({
        productName: 'Updated Test Product',
      });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error', 'No such product');
  });

  //deleteProduct test case scenarios
  it('should delete a product', async () => {
    const response = await request(app).delete(`/api/products/${product}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('_id', product);
  });

  it('should handle invalid Product ID', async () => {
    const invalidProductId = 'invalid_product_id';
    const response = await request(app).delete(`/api/products/${invalidProductId}`);
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error', 'No such product');
  });

  it('should handle deleting a non-existent product', async () => {
    const nonExistentProductId = '669d858cc2c8b444f608a21d';

    const response = await request(app).delete(`/api/products/${nonExistentProductId}`);

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error', 'No such product');
  });

  //filterProducts test case scenarios
  it('should filter products', async () => {
    const filterParams = {
      category: 'Men',
      maxPrice: 80,
      limit: 5,
    };

    const response = await request(app)
      .get('/api/products/filter')
      .query(filterParams);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });
});
