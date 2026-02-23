"use client";

// @ts-ignore
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

export default function SwaggerPage() {
  return (
    <div style={{ padding: 24 }}>
      <h1>API Dokumentacija</h1>
      <SwaggerUI url="/api/swagger" />
    </div>
  );
}