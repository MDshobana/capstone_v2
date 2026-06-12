import request from "supertest";
import path from "path";
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

  // ✅ Setup DB
  beforeAll(async () => {
    await connectTestDB();
  });

  // ✅ Clean DB
  afterEach(async () => {
    await clearTestDB();
  });

  // ✅ Close DB
  afterAll(async () => {
    await closeTestDB();
  });

  // ✅ DASHBOARD
  test("GET /dashboard", async () => {
    app = await createTestApp("student");

    const res = await request(app).get("/api/protected/dashboard");
    expect(res.statusCode).toBe(200);
  });

  // ✅ JOBS

  test("POST /jobs → create job", async () => {
    app = await createTestApp("company");

    const res = await request(app)
      .post("/api/protected/jobs")
      .send({
        title: "Test Job",
        description: "Test Description"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Job posted ✅");
  });

  test("GET /jobs → get jobs", async () => {
    app = await createTestApp("student");

    const res = await request(app).get("/api/protected/jobs");

    expect(res.statusCode).toBe(200);

    if (res.body.length > 0) {
      jobId = res.body[0]._id;
    }
  });

  test("POST /apply → apply job", async () => {
    app = await createTestApp("student");

    const res = await request(app)
      .post("/api/protected/apply")
      .field("jobId", jobId || "507f1f77bcf86cd799439011")
      .attach("resume", path.resolve("tests/sample.pdf"));

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Application submitted ✅");
  });

  test("GET /applications/:jobId", async () => {
    app = await createTestApp("company");

    const res = await request(app).get(
      `/api/protected/applications/${jobId || "507f1f77bcf86cd799439011"
      }`
    );

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // ✅ COURSES

  test("GET /courses", async () => {
    app = await createTestApp();

    const res = await request(app).get("/api/protected/courses");
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
      .field("price", "100")
      .attach("thumbnail", path.resolve("tests/sample.png"))
      .attach("video", path.resolve("tests/sample.avi"));

    expect(res.statusCode).toBe(200);
  });

  // ✅ ENROLLMENT

  test("POST /enroll", async () => {
    app = await createTestApp("student");

    const res = await request(app)
      .post("/api/protected/enroll")
      .send({
        courseId: "507f1f77bcf86cd799439011"
      });

    expect(res.statusCode).toBe(200);
  });

  // ✅ QUIZ

  test("POST /quiz", async () => {
    app = await createTestApp("trainer");

    const res = await request(app)
      .post("/api/protected/quiz")
      .send({
        courseId: "507f1f77bcf86cd799439011",
        questions: [
          {
            question: "Test?",
            options: ["a", "b", "c", "d"],
            correctAnswer: "a"
          }
        ]
      });

    expect(res.statusCode).toBe(200);
  });

  test("GET /quiz/:courseId", async () => {

    app = await createTestApp("trainer");

    // ✅ create quiz first
    await request(app)
      .post("/api/protected/quiz")
      .send({
        courseId: "507f1f77bcf86cd799439011",
        questions: [
          {
            question: "Test?",
            options: ["a", "b", "c", "d"],
            correctAnswer: "a"
          }
        ]
      });


    const res = await request(app).get(
      "/api/protected/quiz/507f1f77bcf86cd799439011"
    );

    expect(res.statusCode).toBe(200);
  });

  // ✅ ASSIGNMENT

  test("POST /submit-assignment", async () => {
    app = await createTestApp("student");

    const res = await request(app)
      .post("/api/protected/submit-assignment")
      .field("courseId", "507f1f77bcf86cd799439011")
      .field("assignmentName", "Test Assignment")
      .attach("file", path.resolve("tests/sample.pdf"));

    expect(res.statusCode).toBe(200);
  });

});
