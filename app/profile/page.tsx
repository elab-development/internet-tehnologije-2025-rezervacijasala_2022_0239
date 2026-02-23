"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import { apiFetch } from "@/lib/api";
import Button from "../../components/Button";
import Input from "../../components/Input";

export default function ProfilePage() {
  const { user, logout, updateUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPass, setIsChangingPass] = useState(false);

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
    }
  }, [user]);

  if (!user) {
    return <p style={{ padding: 40, textAlign: "center" }}>Učitavanje...</p>;
  }

  const u = user;

  async function handleUpdateInfo() {
    setMessage("");

    if (!firstName.trim() || !lastName.trim()) {
      setMessage("Ime i prezime su obavezni.");
      return;
    }

    try {
      const updatedUser = await apiFetch(`/api/users/${u.id}`, {
        method: "PUT",
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
        }),
      });

      updateUser({
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
      });

      setMessage("Podaci uspešno sačuvani! ✅");
      setIsEditing(false);
    } catch (err: any) {
      setMessage(err.message || "Greška pri čuvanju.");
    }
  }


  async function handleChangePassword() {
    setMessage("");

    if (!oldPassword || !newPassword) {
      setMessage("Oba polja su obavezna.");
      return;
    }

    if (newPassword.length < 6) {
      setMessage("Nova šifra mora imati najmanje 6 karaktera.");
      return;
    }

    try {
      await apiFetch(`/api/users/${u.id}/password`, {
        method: "PUT",
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      setMessage("Šifra uspešno promenjena! 🔐");
      setIsChangingPass(false);
      setOldPassword("");
      setNewPassword("");
    } catch (err: any) {
      setMessage(err.message || "Greška pri promeni šifre.");
    }
  }

  return (
    <main
      style={{
        padding: "60px 24px",
        maxWidth: 550,
        margin: "0 auto",
        minHeight: "80vh",
      }}
    >
      <h1
        style={{
          marginBottom: 32,
          textAlign: "center",
          color: "#1a202c",
          fontSize: "2.5rem",
        }}
      >
        Profil
      </h1>

      <div
        style={{
          backgroundColor: "white",
          borderRadius: "24px",
          padding: "40px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
          border: "1px solid #f0f0f0",
        }}
      >

        {!isEditing && !isChangingPass && (
          <div style={{ display: "grid", gap: 24 }}>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: 80,
                  height: 80,
                  backgroundColor: "#f3e8ff",
                  color: "#6b21a8",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                  fontSize: 28,
                  fontWeight: "bold",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                }}
              >
                {u.firstName[0]?.toUpperCase()}
                {u.lastName[0]?.toUpperCase()}
              </div>

              <h2 style={{ margin: 0 }}>
                {u.firstName} {u.lastName}
              </h2>

              <span
                style={{
                  backgroundColor: "#f3e8ff",
                  color: "#6b21a8",
                  padding: "4px 12px",
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                {u.role}
              </span>
            </div>

            <div
              style={{
                padding: 20,
                backgroundColor: "#f8fafc",
                borderRadius: 16,
              }}
            >
              <p
                style={{
                  margin: "0 0 6px",
                  fontSize: 12,
                  color: "#718096",
                  fontWeight: 600,
                }}
              >
                EMAIL ADRESA (ne može se mijenjati)
              </p>
              <p style={{ margin: 0, color: "#2d3748" }}>{u.email}</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Button onClick={() => setIsEditing(true)}>
                Izmeni lične podatke
              </Button>

              <Button onClick={() => setIsChangingPass(true)}>
                Promeni šifru
              </Button>
            </div>
          </div>
        )}

        {isEditing && (
          <div style={{ display: "grid", gap: 20 }}>
            <h3 style={{ margin: 0 }}>Uredi ime i prezime</h3>

            <Input label="Ime" value={firstName} onChange={setFirstName} />
            <Input label="Prezime" value={lastName} onChange={setLastName} />

            <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
              <Button onClick={handleUpdateInfo}>Sačuvaj</Button>
              <Button onClick={() => setIsEditing(false)}>Otkaži</Button>
            </div>
          </div>
        )}


        {isChangingPass && (
          <div style={{ display: "grid", gap: 20 }}>
            <h3 style={{ margin: 0 }}>Promjena šifre</h3>

            <Input
              label="Trenutna šifra"
              type="password"
              value={oldPassword}
              onChange={setOldPassword}
            />
            <Input
              label="Nova šifra"
              type="password"
              value={newPassword}
              onChange={setNewPassword}
            />

            <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
              <Button onClick={handleChangePassword}>
                Potvrdi novu šifru
              </Button>
              <Button onClick={() => setIsChangingPass(false)}>
                Otkaži
              </Button>
            </div>
          </div>
        )}

        {message && (
          <p
            style={{
              textAlign: "center",
              marginTop: 20,
              color:
                message.includes("✅") || message.includes("🔐")
                  ? "#2f855a"
                  : "#c53030",
            }}
          >
            {message}
          </p>
        )}
      </div>
    </main>
  );
}
