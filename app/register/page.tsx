"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import Button from "@/components/Button";
import Input from "@/components/Input";

export default function RegisterPage() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
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

      await apiFetch("/api/auth", {
        method: "POST",
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
        }),
      });

      setMessage("Uspešno ste se registrovali. Prijavite se.");
      router.push("/login");
    } catch (err: any) {
      setError(err.message || "Greška pri registraciji");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: 24, maxWidth: 420, margin: "0 auto" }}>
      <h1>Registracija</h1>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 14 }}>
        <Input
          label="Ime"
          value={firstName}
          onChange={setFirstName}
          placeholder="Ime"
        />

        <Input
          label="Prezime"
          value={lastName}
          onChange={setLastName}
          placeholder="Prezime"
        />

        <Input
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="email@test.com"
        />

        <Input
          label="Lozinka"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="minimum 6 karaktera"
        />

        <Button type="submit" disabled={loading}>
          {loading ? "Registrujem..." : "Registruj se"}
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
