const request = require("supertest");
const app = require("../server");

describe("Customer Routes", () => {
  let customer;
  //addCustomer test case scenarios
  it("should add a customer", async () => {
    const response = await request(app)
      .post("/api/customers/createCustomer")
      .send({
        name: "Test Customer",
        phone: "1234567890",
        email: "test@example.com",
        password: "test1234",
      });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("_id");
    expect(response.body.name).toBe("Test Customer");
    customer = response.body._id;
  });

  it("should handle errors when adding a customer", async () => {
    const response = await request(app)
      .post("/api/customers/createCustomer")
      .send({
        name: "John Doe",
      });
    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty("error");
  });

  //authCustomer test case scenarios
  it("should authenticate a customer", async () => {
    const response = await request(app).post("/api/customers/login").send({
      email: "test@example.com",
      password: "test1234",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body._id).toBe(customer);
  });

  it("should handle non-existent customer", async () => {
    const response = await request(app).post("/api/customers/login").send({
      email: "nonexistent@example.com",
      password: "somepassword",
    });

    expect(response.statusCode).toBe(401);
    expect(response.body).toBe("No such customer");
  });

  it("should handle incorrect password", async () => {
    const response = await request(app).post("/api/customers/login").send({
      email: "test@example.com",
      password: "incorrectpassword",
    });

    expect(response.statusCode).toBe(401);
    expect(response.body).toBe("Wrong password");
  });

  //getAllCustomer test case scenarios
  it("should get all customers", async () => {
    const response = await request(app).get("/api/customers/");
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  //getCustomer test case scenarios
  it("should get a customer by ID", async () => {
    const response = await request(app).get(`/api/customers/${customer}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("_id", customer);
    expect(response.body).toHaveProperty("name");
  });

  it("should handle invalid customer ID", async () => {
    const invalidCustomerId = "invalid_customer_id";
    const response = await request(app).get(
      `/api/customers/${invalidCustomerId}`
    );
    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty("error", "No such customer");
  });

  it("should handle non-existent customer", async () => {
    const nonExistentCustomerId = "66ac08be8418955ea4b93bdd";
    const response = await request(app).get(
      `/api/customers/${nonExistentCustomerId}`
    );
    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty("error", "No such customer");
  });

  //updateCustomer test case scenarios
  it("should update a customer without password change", async () => {
    const updateParams = {
      id: customer,
      name: "Updated Name",
      phone: "1234567890",
      email: "test1@example.com",
    };
    const response = await request(app)
      .patch(`/api/customers/`)
      .send(updateParams);
    console.log("Response:", response.body);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("_id", customer);
  });

  it("should update a customer with password change", async () => {
    const updateParams = {
      id: customer,
      currentPassword: "test1234",
      password: "test123",
    };
    const response = await request(app)
      .patch(`/api/customers/`)
      .send(updateParams);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("_id", customer);
  });

  it("should handle wrong current password", async () => {
    const updateParams = {
      id: customer,
      currentPassword: "yudgduc",
      password: "new_password",
    };
    const response = await request(app)
      .patch(`/api/customers/`)
      .send(updateParams);
    expect(response.statusCode).toBe(401);
    expect(response.body).toBe("Incorrect Current Password!");
  });

  //deleteCustomer test case scenarios
  it("should delete a customer by ID", async () => {
    const response = await request(app).delete(`/api/customers/${customer}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("_id", customer);
    expect(response.body).toHaveProperty("name");
  });

  it("should handle invalid customer ID", async () => {
    const invalidCustomerId = "invalid_customer_id";
    const response = await request(app).delete(
      `/api/customers/${invalidCustomerId}`
    );
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("error", "No such customer");
  });

  it("should handle non-existent customer", async () => {
    const nonExistentCustomerId = "66ac09b07b349eec678c701e";
    const response = await request(app).delete(
      `/api/customers/${nonExistentCustomerId}`
    );
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("error", "No such customer");
  });
});
