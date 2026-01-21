"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { apiFetch } from "@/lib/api";
import Button from "../../components/Button";
import Input from "../../components/Input";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  setMessage(null);
  setError(null);

  if (!email.includes("@")) {
    setError("Unesi ispravan email.");
    return;
  }
  if (password.length < 6) {
    setError("Lozinka mora imati bar 6 karaktera.");
    return;
  }

  try {
    setLoading(true);

    const data = await apiFetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    // ✅ KLJUČNA ISPRAVKA
    login({
      id: data.user.id,
      email: data.user.email,
      role: data.user.role,
    });

    setMessage("Uspešno ste prijavljeni.");
    router.push("/halls");
  } catch (err: any) {
    setError(err.message || "Greška pri prijavi");
  } finally {
    setLoading(false);
  }
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

        <Button type="submit" disabled={loading}>
          {loading ? "Prijava..." : "Prijavi se"}
        </Button>

        {message && (
          <p style={{ marginTop: 6, fontSize: 14, color: "green" }}>
            {message}
          </p>
        )}
        {error && (
          <p style={{ marginTop: 6, fontSize: 14, color: "red" }}>
            {error}
          </p>
        )}
      </form>
    </main>
  );
}
