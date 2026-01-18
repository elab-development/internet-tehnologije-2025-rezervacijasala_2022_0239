"use client";

import { useState } from "react";
import Button from "../../components/Button";
import Input from "../../components/Input";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!email.includes("@")) {
      setMessage("Unesi ispravan email.");
      return;
    }
    if (password.length < 6) {
      setMessage("Lozinka mora imati bar 6 karaktera.");
      return;
    }

    setMessage("Forma je validna. Sledeće ćemo povezati na backend.");
  }

  return (
    <main style={{ padding: 24, maxWidth: 420, margin: "0 auto" }}>
      <h1>Prijava</h1>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 14 }}>
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="npr. doris@gmail.com"
        />
        <Input
          label="Lozinka"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="Unesi lozinku"
        />

        <Button type="submit">Prijavi se</Button>

        {message && (
          <p style={{ marginTop: 6, fontSize: 14 }}>
            {message}
          </p>
        )}
      </form>
    </main>
  );
}

