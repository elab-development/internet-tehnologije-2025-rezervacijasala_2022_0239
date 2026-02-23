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
    
    tags: [
      { name: "Auth", description: "Registracija, login, tokeni" },
      { name: "Cities", description: "Gradovi / lokacije" },
      { name: "Halls", description: "Sale i dostupnost" },
      { name: "Reservations", description: "Rezervacije" },
      { name: "Currency", description: "Kursna lista / konverzija valuta" },
      { name: "Dashboard", description: "Statistika i analitika" },
      { name: "HallCategories", description: "Kategorije sala (CRUD i validacije)" },
      { name: "Users", description: "Upravljanje korisnicima (admin)" },
      { name: "Email", description: "Slanje email notifikacija (Resend)" }
    ],
  },
  apis: swaggerRoutes
};

const swaggerSpec = swaggerJsdoc(options);

export async function GET(req: NextRequest) {
  return NextResponse.json(swaggerSpec);
}
