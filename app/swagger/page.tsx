"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import "swagger-ui-react/swagger-ui.css";
import "./swagger-overrides.css"; // napravi fajl ispod

const SwaggerUI = dynamic(() => import("swagger-ui-react"), { ssr: false });

type Env = "local" | "staging" | "prod";

export default function SwaggerPage() {
  const [env, setEnv] = useState<Env>("local");
  const [token, setToken] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("swagger_token") || "";
    setToken(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("swagger_token", token);
  }, [token]);

  const specUrl = useMemo(() => {
    // Ako nemaš staging/prod, ostavi sve na local
    if (env === "local") return "/api/swagger";
    if (env === "staging") return "https://staging.tvoj-domen.com/api/swagger";
    return "https://tvoj-domen.com/api/swagger";
  }, [env]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Header / Toolbar */}
      <div className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold">
              API
            </div>
            <div>
              <div className="text-sm text-gray-500">Rezervacija Sala</div>
              <div className="text-lg font-semibold">Swagger Docs</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <select
              className="rounded-lg border px-3 py-2 text-sm"
              value={env}
              onChange={(e) => setEnv(e.target.value as Env)}
            >
              <option value="local">Local</option>
              <option value="staging">Staging</option>
              <option value="prod">Prod</option>
            </select>

            <a
              className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
              href={specUrl}
              target="_blank"
              rel="noreferrer"
            >
              OpenAPI JSON
            </a>
          </div>
        </div>

        {/* Token bar */}
        <div className="mx-auto max-w-6xl px-4 pb-3">
          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            <div className="text-sm text-gray-600 md:w-40">Bearer token</div>
            <input
              className="w-full rounded-lg border px-3 py-2 text-sm"
              placeholder="Paste JWT token (optional) — used for Try it out"
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
            <button
              className="rounded-lg bg-purple-600 px-4 py-2 text-sm text-white hover:bg-purple-700"
              onClick={() => setToken("")}
            >
              Clear
            </button>
          </div>
          <div className="mt-1 text-xs text-gray-500">
            Token se čuva u localStorage samo za tvoj browser (dev).
          </div>
        </div>
      </div>

      {/* Swagger UI */}
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="rounded-2xl border bg-white p-3 shadow-sm">
          <SwaggerUI
            url={specUrl}
            deepLinking
            displayRequestDuration
            filter
            docExpansion="list"                 // "none" | "list" | "full"
            defaultModelsExpandDepth={-1}       // sakrij Models sekciju (može 0/1 ako želiš)
            persistAuthorization
            requestInterceptor={(req) => {
              if (token?.trim()) {
                req.headers = req.headers || {};
                req.headers["Authorization"] = `Bearer ${token.trim()}`;
              }
              return req;
            }}
          />
        </div>
      </div>
    </div>
  );
}