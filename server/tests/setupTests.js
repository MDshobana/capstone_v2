
import { vi } from "vitest";
process.env.NODE_ENV = "test";
console.log("✅ SETUP FILE LOADED");

vi.mock("multer-storage-cloudinary", () => {
  return {
    CloudinaryStorage: class { }
  };
});

vi.mock("multer", () => ({
  __esModule: true,

  default: Object.assign(
    () => ({
      single: () => (req, res, next) => {
        req.file = {
          filename: "mock-file.pdf",
          path: "https://mock-file.com/file.pdf"
        };
        if (!req.body) req.body = {};
        next();
      },

      fields: () => (req, res, next) => {
        req.files = {
          thumbnail: [{ path: "https://mock.com/thumb.jpg" }],
          video: [{ path: "https://mock.com/video.mp4" }]
        };
        if (!req.body) req.body = {};
        next();
      }
    }),

    {
    
      diskStorage: () => ({
        _mock: true // dummy value
      })
    }
  )
}));
``

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

vi.mock("../middleware/auth.js", () => ({
  default: (req, res, next) => {
    req.user = {

      id: "507f1f77bcf86cd799439011",
      role: "student"

    };
    next();
  }
}));


vi.mock("../middleware/authorize.js", () => ({
  default: () => (req, res, next) => next()
}));
