import request from "supertest";
import { describe, test, expect } from "vitest";
import { createTestApp } from "./testApp.js";

describe("Mock APIs", () => {
  test("POST /chat", async () => {
    const app = await createTestApp("student");

    const res = await request(app)
      .post("/api/protected/chat")
      .send({ message: "Hello" });

    expect(res.statusCode).toBe(200);
  });
});
