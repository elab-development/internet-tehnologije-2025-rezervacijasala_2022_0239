"use client";

import { useState } from "react";
import Button from "../../components/Button";
import Input from "../../components/Input";

export default function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (firstName.trim().length < 2) {
      setMessage("Unesi ime (bar 2 slova).");
      return;
    }
    if (lastName.trim().length < 2) {
      setMessage("Unesi prezime (bar 2 slova).");
      return;
    }
    if (!email.includes("@")) {
      setMessage("Unesi ispravan email.");
      return;
    }
    if (password.length < 6) {
      setMessage("Lozinka mora imati bar 6 karaktera.");
      return;
    }

    setMessage("Registracija je validna (sledeće povezujemo sa backendom).");
  }

  return (
    <main style={{ padding: 24, maxWidth: 520, margin: "0 auto" }}>
      <h1>Registracija</h1>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 14 }}>
        <Input
          label="Ime"
          value={firstName}
          onChange={setFirstName}
          placeholder="npr. Doris"
        />
        <Input
          label="Prezime"
          value={lastName}
          onChange={setLastName}
          placeholder="npr. Šmulja"
        />
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

        <Button type="submit">Napravi nalog</Button>

        {message && <p style={{ marginTop: 6, fontSize: 14 }}>{message}</p>}
      </form>
    </main>
  );
}
