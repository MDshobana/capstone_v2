import request from "supertest";
import { describe, test, expect, vi } from "vitest";
import { createTestApp } from "./testApp.js";

import { vi } from "vitest";


vi.mock("multer", () => {
  return {
    default: () => ({
      single: () => (req, res, next) => {
        req.file = { path: "https://mock-file-url.com/file.pdf" };
        next();
      },
      fields: () => (req, res, next) => {
        req.files = {
          thumbnail: [{ filename: "thumb.jpg" }],
          video: [{ filename: "video.mp4" }]
        };
        next();
      }
    })
  };
});


// ✅ mocks
vi.mock("openai", () => ({
  default: class {
    chat = {
      completions: {
        create: vi.fn().mockResolvedValue({
          choices: [{ message: { content: "Mock AI response" } }]
        })
      }
    }
  }
}));

vi.mock("razorpay", () => ({
  default: class {
    orders = {
      create: vi.fn().mockResolvedValue({ id: "order_mock_123" })
    }
  }
}));

describe("Mock APIs", () => {

  test("POST /chat", async () => {
    const app = await createTestApp("student");

    const res = await request(app)
      .post("/api/protected/chat")
      .send({ message: "Hello" });

    expect(res.statusCode).toBe(200);
  });

});
