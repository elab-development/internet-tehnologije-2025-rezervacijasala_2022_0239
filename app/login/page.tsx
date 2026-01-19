"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../providers";
import Button from "../../components/Button";
import Input from "../../components/Input";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

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

    const role =
      email.toLowerCase().includes("admin")
        ? "ADMIN"
        : email.toLowerCase().includes("manager")
        ? "MANAGER"
        : "USER";

    login(role);
    setMessage(`Ulogovana si kao ${role}.`);
    router.push("/halls");
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

        {message && <p style={{ marginTop: 6, fontSize: 14 }}>{message}</p>}
      </form>
    </main>
  );
}

