const request = require("supertest");
const express = require("express");

const app = express();
app.use(express.json());

app.post("/api/register", (req, res) => {
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    return res.status(400).json({ success: false, message: "All fields required" });
  }
  return res.status(200).json({ success: true, message: "Registration saved" });
});

describe("POST /api/register", () => {
  it("should return 200 if all fields are provided", async () => {
    const response = await request(app)
      .post("/api/register")
      .send({ name: "John", email: "john@example.com", phone: "12345678" });
    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it("should return 400 if fields are missing", async () => {
    const response = await request(app)
      .post("/api/register")
      .send({ name: "" });
    expect(response.statusCode).toBe(400);
  });
});