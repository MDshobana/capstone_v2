import { Component } from "react";
import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "SkillSphere API",
      version: "1.0.0",
      description: "API documentation for SkillSphere backend"
    },
    components:{
      securitySchemes: {
        cookieAuth:{
          type: "apiKey",
          in: "cookie",
          name: "token"
        },
        bearerAuth: {
          type:"http",
          scheme: "bearer",
          bearerFormat: "jwt",
        }
      }
    },
    security: [
      {
        cookieAuth:[]
      }
    ],
    servers: [

      {
        url: "http://localhost:5000",
        description: "Local server"
      },
      {
        url: "https://mylearningportal.site/api/protected",
        description: "Production server"
      }

    ]
  },
  apis: ["./**/*.js"]  //["./server/routes/*.js"] // reads your route files
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;