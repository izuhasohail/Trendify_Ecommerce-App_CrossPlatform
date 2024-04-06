const request = require('supertest');
const app = require('../server');

describe('Review Routes', () => {
  let review;
  const customerId = '659fc2d944ab4b4734019dfc';
  const productId = '659e3dfd9676229c0957f5c6';

  //addReview test case scenarios
  it('should add a review', async () => {
    const response = await request(app)
      .post('/api/reviews/')
      .send({
        customer: customerId,
        product: productId,
        rating: 5,
        reviewMessage: 'Great product!',
        orderId: '659e3dfd9775829c0957f5c6',
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('_id');
    expect(response.body.customer).toBe(customerId);
    expect(response.body.product).toBe(productId);
    expect(response.body.rating).toBe(5);
    expect(response.body.reviewMessage).toBe('Great product!');
    expect(response.body.orderId).toBe('659e3dfd9775829c0957f5c6');
    review = response.body._id
  });

  it('should handle missing or invalid parameters', async () => {
    const response = await request(app)
      .post('/api/reviews/')
      .send({
        // Missing required parameters
      });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  //getAllReviews test case scenarios
  it('should get all reviews', async () => {
    const response = await request(app)
      .get('/api/reviews/')
      .expect(200);

    expect(response.body).toBeDefined();
    expect(response.body.length).toBeGreaterThanOrEqual(0);
  });

  //getReview test case scenarios
  it('should get a single review', async () => {
    const response = await request(app)
      .get(`/api/reviews/${review}`)
      .expect(200);

    expect(response.body).toBeDefined();
    expect(response.body._id).toBe(review);
  });
  
  it('should handle an invalid review Id', async () => {
    const invalid_review_id = 'invalid_review_id'
    const response = await request(app)
      .get(`/api/reviews/${invalid_review_id}`)
      .expect(404);

    expect(response.body).toBeDefined();
    expect(response.body).toHaveProperty('error', 'No such review');
  });

  it('should handle non-existent review for getReview', async () => {
    const nonExistentOrderId = '66a17d50f52c1c432955bf11';
    const response = await request(app)
      .get(`/api/reviews/${nonExistentOrderId}`)
      .expect(404);

    expect(response.body).toBeDefined();
    expect(response.body.error).toBe('No such review');
  });

  //updateReview test case scenarios
  it('should update a review', async () => {
    const response = await request(app)
      .patch(`/api/reviews/${review}`)
      .send({
        rating: 4,
        reviewMessage: 'Updated review',
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('_id', review);
  });

  it('should handle updating a non-existing review', async () => {
    const nonExistentReviewId = '66a17d50f52c1c432955bf11';
    const response = await request(app)
      .patch(`/api/reviews/${nonExistentReviewId}`)
      .send({
        // Update parameters as needed
      });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error', 'No such review');
  });

  it('should handle updating with an invalid ID', async () => {
    const invalid_review_id = 'invalid_review_id';
    const response = await request(app)
      .patch(`/api/reviews/${invalid_review_id}`)
      .send({
        // Update parameters as needed
      });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error', 'No such review');
  });

  //productReviews test case scenarios
  it('should get reviews for a product', async () => {
    const response = await request(app)
      .get('/api/reviews/productReviews/')
      .query({ product: productId });

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it('should handle getting reviews for an invalid product ID', async () => {
    const response = await request(app)
      .get('/api/reviews/productReviews')
      .query({ product: 'invalidProductId' });

    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('error', 'Invalid product ID');
  });

  //deleteReview test case scenarios
  it('should delete a review', async () => {
    const response = await request(app)
      .delete(`/api/reviews/${review}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('_id', review);
  });

  it('should handle deleting a review with an invalid ID', async () => {
    const response = await request(app)
      .delete('/api/reviews/1234');

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error', 'No such review');
  });

  it('should handle deleting a non-existing review', async () => {
    const nonExistentReviewId = '66a17d50f52c1c432955bf11';
    const response = await request(app)
      .delete(`/api/reviews/${nonExistentReviewId}`);

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error', 'No such review');
  });
});
