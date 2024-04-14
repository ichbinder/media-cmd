import request from "supertest";
import mongoose from "mongoose";
import { Express } from "express";
import { createApp } from "./app"; // Extrahiere die App-Erstellung in eine separate Funktion

describe("App", () => {
  let app: Express;

  beforeAll(async () => {
    app = createApp();
    await mongoose.connect("mongodb://localhost:27017/test_db", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should respond with "Hello world!" on GET /', async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.text).toBe("Hello world!");
  });

  it("should respond with 404 for non-existing routes", async () => {
    const response = await request(app).get("/non-existing-route");
    expect(response.status).toBe(404);
  });

  it("should have the auth router mounted on /auth", async () => {
    const response = await request(app).get("/auth");
    expect(response.status).not.toBe(404);
  });

  it("should have the usenet router mounted on /search", async () => {
    const response = await request(app).get("/search");
    expect(response.status).not.toBe(404);
  });

  it("should have the tmdb router mounted on /tmdb", async () => {
    const response = await request(app).get("/tmdb");
    expect(response.status).not.toBe(404);
  });
});
