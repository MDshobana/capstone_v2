

import request from "supertest";
import app from "../app.js";
import path from "path";


describe("Job API", () => {
  let jobId;

  test("POST /jobs → should create a job", async () => {

    app.use((req, res, next) => {
      req.user = {
        id: "123",
        role: "company"
      };
      next();
    });

    const res = await request(app)
      .post("/api/protected/jobs")
      .send({
        title: "Test Job",
        description: "Test Description"

      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Job posted ✅");

  });


  test("GET /jobs → should return jobs", async () => {


    app.use((req, res, next) => {
      req.user = {
        id: "123",
        role: "company"
      };
      next();
    });

    const res = await request(app)
      .get("/api/protected/jobs");

    expect(res.statusCode).toBe(200);

    expect(Array.isArray(res.body)).toBe(true);

    jobId = res.body[0]?._id; // store jobId
  });

  // ✅ TEST: apply to job
  test("POST /apply → student applies", async () => {

    app.use((req, res, next) => {
      req.user = {
        id: "123",
        role: "company"
      };
      next();
    });

    const res = await request(app)
      .post("/api/protected/apply")

      .field("jobId", jobId)
      .attach("resume", path.resolve("tests/sample.pdf"));

    // .send({
    //   jobId,
    //   resumeUrl: "sample.pdf"
    // });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Application submitted ✅");
  });

  // ✅ TEST: get applications
  test("GET /applications/:jobId → returns applications", async () => {

    app.use((req, res, next) => {
      req.user = {
        id: "123",
        role: "company"
      };
      next();
    });

    const res = await request(app)
      .get(`/api/protected/applications/${jobId}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

});
