// tests/testApp.js

import express from "express";

export const createTestApp = async (role = "student") => {
  const app = express();

  app.use(express.json());

  // ✅ mock auth
  app.use((req, res, next) => {
    req.user = {
      id: "6a27ef4b1c6660427c53d0d7",
      email: "test@test.com",
      role
    };
    next();
  });

  // ✅ dynamic import AFTER mocks
  const { default: router } = await import("../routes/protectedRoutes.js");

  app.use("/api/protected", router);

  return app; 
};