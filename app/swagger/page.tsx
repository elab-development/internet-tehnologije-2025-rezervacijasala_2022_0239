"use client";

import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";
import "./swagger-overrides.css";

const SwaggerUI = dynamic(() => import("swagger-ui-react"), { ssr: false });

// Ako ti je API JSON uvek ovde:
const SPEC_URL = "/api/swagger";

export default function SwaggerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="mx-auto max-w-6xl px-4 py-6">
        {/* Samo OpenAPI JSON dugme */}
        <div className="mb-3 flex justify-end">
          <a
            className="rounded-lg border bg-white px-3 py-2 text-sm hover:bg-gray-50"
            href={SPEC_URL}
            target="_blank"
            rel="noreferrer"
          >
            OpenAPI JSON
          </a>
        </div>

        {/* Swagger UI */}
        <div className="rounded-2xl border bg-white p-3 shadow-sm">
          <SwaggerUI
            url={SPEC_URL}
            deepLinking
            displayRequestDuration
            filter
            docExpansion="list"
            defaultModelsExpandDepth={-1}
          />
        </div>
      </div>
    </div>
  );
}