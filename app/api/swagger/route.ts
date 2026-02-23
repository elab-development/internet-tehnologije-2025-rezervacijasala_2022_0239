import { NextRequest, NextResponse } from "next/server";
import swaggerJsdoc from "swagger-jsdoc";
import { swaggerRoutes } from "./swagger-routes";

// Opcije za Swagger
const options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Rezervacija Sala API",
      version: "1.0.0",
      description: "API dokumentacija za naš projekat",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: swaggerRoutes
};

const swaggerSpec = swaggerJsdoc(options);

export async function GET(req: NextRequest) {
  return NextResponse.json(swaggerSpec);
}
