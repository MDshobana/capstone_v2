
import request from "supertest";
import {
  describe,
  test,
  expect,
  beforeAll,
  afterAll,
  afterEach
} from "vitest";

import { createTestApp } from "./testApp.js";
import {
  connectTestDB,
  closeTestDB,
  clearTestDB
} from "./setupTestDB.js";

describe("Full API Tests", () => {
  let app;
  let jobId;

  beforeAll(async () => {
    await connectTestDB();
  });

  afterEach(async () => {
    await clearTestDB();
  });

  afterAll(async () => {
    await closeTestDB();
  });

  test("GET /dashboard", async () => {
    app = await createTestApp("student");

    const res = await request(app).get("/api/protected/dashboard");
    expect(res.statusCode).toBe(200);
  });

  test("POST /jobs → create job", async () => {
    app = await createTestApp("company");

    const res = await request(app)
      .post("/api/protected/jobs")
      .send({
        title: "Test Job",
        description: "Test Description"
      });

    expect(res.statusCode).toBe(200);
  });

  test("POST /apply → apply job", async () => {
    app = await createTestApp("student");

    const res = await request(app)
      .post("/api/protected/apply")
      .field("jobId", "507f1f77bcf86cd799439011");

    expect(res.statusCode).toBe(200);
  });

  test("POST /courses/upload", async () => {
    app = await createTestApp("trainer");

    const res = await request(app)
      .post("/api/protected/courses/upload")
      .field("title", "Test Course")
      .field("description", "Desc")
      .field("category", "Dev")
      .field("level", "Beginner")
      .field("price", "100");

    expect(res.statusCode).toBe(200);
  });

  test("POST /submit-assignment", async () => {
    app = await createTestApp("student");

    const res = await request(app)
      .post("/api/protected/submit-assignment")
      .field("courseId", "507f1f77bcf86cd799439011")
      .field("assignmentName", "Test Assignment");

    expect(res.statusCode).toBe(200);
  });
});
