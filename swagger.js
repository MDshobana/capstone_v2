import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "SkillSphere API",
      version: "1.0.0",
      description: "API documentation for SkillSphere backend"
    },
    servers: [

      {
        url: "http://localhost:5000",
        description: "Local server"
      },
      {
        url: "https://mylearningportal.site",
        description: "Production server"
      }

    ]
  },
  apis: ["./routes/*.js"] // reads your route files
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;