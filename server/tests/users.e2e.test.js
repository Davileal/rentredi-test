const request = require("supertest");
const app = require("../src/app");

jest.mock("../src/repositories/users.repo", () => ({
  createUser: jest.fn(),
  getAllUsers: jest.fn(),
  getUserById: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
}));

jest.mock("../src/services/openweather.service.js", () => ({
  fetchLocationByZip: jest.fn(),
}));

const repo = require("../src/repositories/users.repo.js");
const weather = require("../src/services/openweather.service.js");

describe("/users CRUD", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /users", () => {
    it("creates a user with lat/lon/timezone fetched from OpenWeather", async () => {
      weather.fetchLocationByZip.mockResolvedValue({
        latitude: 40.71,
        longitude: -74.01,
        timezone: -14400,
      });
      repo.createUser.mockImplementation(async (u) => ({ id: "abc123", ...u }));

      const res = await request(app)
        .post("/users")
        .send({ name: "Jane Doe", zipCode: "10001" });

      expect(res.status).toBe(201);
      expect(weather.fetchLocationByZip).toHaveBeenCalledWith("10001");
      expect(repo.createUser).toHaveBeenCalledWith({
        name: "Jane Doe",
        zipCode: "10001",
        latitude: 40.71,
        longitude: -74.01,
        timezone: -14400,
      });

      expect(res.body).toMatchObject({
        id: "abc123",
        name: "Jane Doe",
        zipCode: "10001",
        latitude: 40.71,
        longitude: -74.01,
        timezone: -14400,
      });
    });

    it("returns 400 when required fields are missing", async () => {
      const res = await request(app).post("/users").send({ name: "Only name" });
      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({ error: '"zipCode" is required' });
    });

    it("propagates OpenWeather errors as 500", async () => {
      weather.fetchLocationByZip.mockRejectedValue(new Error("Invalid zip"));
      const res = await request(app)
        .post("/users")
        .send({ name: "John", zipCode: "00000" });
      expect(res.status).toBe(500);
      expect(res.body.error).toMatch(/Invalid zip/i);
    });
  });

  describe("GET /users", () => {
    it("lists users", async () => {
      repo.getAllUsers.mockResolvedValue([
        {
          id: "u1",
          name: "A",
          zipCode: "11111",
          latitude: 1,
          longitude: 2,
          timezone: 0,
        },
        {
          id: "u2",
          name: "B",
          zipCode: "22222",
          latitude: 3,
          longitude: 4,
          timezone: 7200,
        },
      ]);

      const res = await request(app).get("/users");
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
      expect(res.body[0]).toMatchObject({
        id: "u1",
      });
      expect(res.body[1]).toMatchObject({
        id: "u2",
      });
    });
  });

  describe("GET /users/:id", () => {
    it("returns a single user when found", async () => {
      repo.getUserById.mockResolvedValue({
        id: "u1",
        name: "Jane",
        zipCode: "10001",
        latitude: 40.71,
        longitude: -74.01,
        timezone: -14400,
      });

      const res = await request(app).get("/users/u1");
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        id: "u1",
        name: "Jane",
      });
    });

    it("returns 404 for unknown id", async () => {
      repo.getUserById.mockResolvedValue(null);
      const res = await request(app).get("/users/missing");
      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: "User not found" });
    });
  });

  describe("PUT /users/:id", () => {
    it("updates name only without refetching OpenWeather", async () => {
      repo.getUserById.mockResolvedValue({
        id: "u1",
        name: "Old",
        zipCode: "10001",
        latitude: 1,
        longitude: 2,
        timezone: 0,
      });

      repo.updateUser.mockImplementation(async (_id, patch) => ({
        ...patch,
        id: "u1",
        zipCode: "10001",
        latitude: 1,
        longitude: 2,
        timezone: 0,
      }));

      const res = await request(app)
        .put("/users/u1")
        .send({ name: "New Name" });

      expect(res.status).toBe(200);
      expect(weather.fetchLocationByZip).not.toHaveBeenCalled();
      expect(repo.updateUser).toHaveBeenCalled();
      expect(res.body.name).toBe("New Name");
    });

    it("refetches OpenWeather when zipCode changes", async () => {
      repo.getUserById.mockResolvedValue({
        id: "u1",
        name: "Jane",
        zipCode: "10001",
        latitude: 1,
        longitude: 2,
        timezone: 0,
      });

      weather.fetchLocationByZip.mockResolvedValue({
        latitude: 10,
        longitude: 20,
        timezone: 3600,
      });

      repo.updateUser.mockImplementation(async (_id, patch) => ({
        id: "u1",
        name: "Jane",
        ...patch,
      }));

      const res = await request(app)
        .put("/users/u1")
        .send({ zipCode: "94105" });

      expect(res.status).toBe(200);
      expect(weather.fetchLocationByZip).toHaveBeenCalledWith("94105");
      expect(res.body).toMatchObject({
        id: "u1",
        zipCode: "94105",
        latitude: 10,
        longitude: 20,
        timezone: 3600,
      });
    });

    it("returns 404 if user does not exist", async () => {
      repo.getUserById.mockResolvedValue(null);
      const res = await request(app).put("/users/unknown").send({ name: "X" });
      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: "User not found" });
    });
  });

  describe("DELETE /users/:id", () => {
    it("deletes an existing user", async () => {
      repo.deleteUser.mockResolvedValue(true);
      const res = await request(app).delete("/users/u1");
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: "User deleted successfully" });
    });

    it("returns 404 when trying to delete missing user", async () => {
      repo.deleteUser.mockResolvedValue(false);
      const res = await request(app).delete("/users/missing");
      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: "User not found" });
    });
  });
});
