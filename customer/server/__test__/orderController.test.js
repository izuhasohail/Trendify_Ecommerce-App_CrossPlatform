const request = require('supertest');
const app = require('../server');

describe('Order Routes', () => {
  let order;
  const customerId = '659fc2d944ab4b4734019dfc'
  //addOrder test case scenarios
  it('should add an order', async () => {
    const orderData = {
      customer: customerId,
      products: [
        { product: '659e3dfd9676229c0957f5c6', quantity: 2 },
        { product: '659e3e719676229c0957f5c8', quantity: 1 },
      ],
      deliveryAddress: 'Delivery Address',
      billingAddress: 'Billing Address',
      total: 189.97,
      paymentMethod: 'Credit Card',
    };
    const response = await request(app)
      .post('/api/orders/placeorder')
      .send(orderData);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('_id');
    order = response.body._id;
  });

  it('should handle errors when adding an order', async () => {
    const incompleteOrderData = {
      // Missing required fields like customer, products, deliveryAddress, etc.
    };
    const response = await request(app)
      .post('/api/orders/placeorder')
      .send(incompleteOrderData);

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  //getAllOrders test case scenarios
  it('should get all orders', async () => {
    const response = await request(app)
      .get('/api/orders/')
      .expect(200);

    expect(response.body).toBeDefined();
    expect(response.body.length).toBeGreaterThanOrEqual(0);
  });

  //getOrder test case scenarios
  it('should get a single order', async () => {
    const response = await request(app)
      .get(`/api/orders/${order}`)
      .expect(200);

    expect(response.body).toBeDefined();
    expect(response.body._id).toBe(order);
  });

  it('should handle non-existent order for getOrder', async () => {
    const nonExistentOrderId = '66a17d50f52c1c432955bf11';
    const response = await request(app)
      .get(`/api/orders/${nonExistentOrderId}`)
      .expect(404);

    expect(response.body).toBeDefined();
    expect(response.body.error).toBe('No such order');
  });

  //custOrders test case scenarios
  it('should get orders of a customer', async () => {
    const response = await request(app)
      .get(`/api/orders/customer/${customerId}`)
      .expect(200);

    expect(response.body).toBeDefined();
    expect(response.body.length).toBeGreaterThanOrEqual(0);
  });

  it('should handle non-existent customer ID for custOrder', async () => {
    const invalid_order_id = 'invalid_order_id';
    const response = await request(app)
      .get(`/api/orders/customer/${invalid_order_id}`)
      .expect(404);

    expect(response.body).toBeDefined();
    expect(response.body.error).toBe('Invalid customer ID');
  });

  //deleteOrder test case scenarios
  it('should delete an order', async () => {
    const response = await request(app).delete(`/api/orders/${order}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('_id', order);
  });

  it('should handle invalid order ID', async () => {
    const invalidOrderId = 'invalid_order_id';
    const response = await request(app).delete(`/api/orders/${invalidOrderId}`);
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error', 'No such order');
  });

  it('should handle deleting a non-existent order', async () => {
    const nonExistentOrderId = '669d858cc2c8b444f608a21d';

    const response = await request(app).delete(`/api/orders/${nonExistentOrderId}`);

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error', 'No such order');
  });
});
