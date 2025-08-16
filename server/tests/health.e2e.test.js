const request = require("supertest");
const app = require("../src/app");

describe("Health routes", () => {
  it("GET / should return welcome message", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.text).toMatch(/Welcome to the RentRedi API!/i);
  });

  it("GET /health should return ok", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });

  it("GET /health/ready should return ready true", async () => {
    const res = await request(app).get("/health/ready");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ready: true });
  });

  it("GET /non-existent should return 404 JSON", async () => {
    const res = await request(app).get("/nope-this-route-does-not-exist");
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "Route not found" });
  });
});
