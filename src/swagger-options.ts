const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.1",
    info: {
      version: "1.0.0",
      title: "VENDING MACHINE API",
      description: `This is a vending machine api.`,
    },
    servers: [
      { description: "Local", url: `http://localhost:${process.env.PORT}` },
    ],
    security: [
      {
        jwt_token: [],
      },
    ],
    components: {
      securitySchemes: {
        jwt_token: {
          type: "apiKey",
          name: "authorization",
          description: "provide jwt token. Bearer jwtToken",
          in: "header",
        },
      },
    },
  },
  apis: ["./src/routes/**/*.ts"],
};

export default swaggerOptions;
