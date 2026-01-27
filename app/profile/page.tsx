"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import { apiFetch } from "@/lib/api";
import Button from "../../components/Button";
import Input from "../../components/Input";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPass, setIsChangingPass] = useState(false); // Novo stanje

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

  if (!user) return <p style={{ padding: 40, textAlign: "center" }}>Učitavanje...</p>;
  const u = user;

  // Funkcija za promenu imena i prezimena
  async function handleUpdateInfo() {
    setMessage("");
    try {
      await apiFetch(`/api/users/${u.id}`, {
        method: "PUT",
        body: JSON.stringify({ firstName, lastName }), // Šaljemo samo ime i prezime
      });
      setMessage("Podaci uspješno sačuvani! ✅");
      setIsEditing(false);
    } catch (err: any) {
      setMessage(err.message || "Greška pri čuvanju.");
    }
  }

  // Funkcija za promenu šifre
  async function handleChangePassword() {
    setMessage("");
    if (!oldPassword || !newPassword) return setMessage("Oba polja su obavezna.");
    
    try {
      await apiFetch(`/api/users/${u.id}/password`, {
        method: "PUT",
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      setMessage("Šifra uspešno promenjena!");
      setIsChangingPass(false);
      setOldPassword("");
      setNewPassword("");
    } catch (err: any) {
      setMessage(err.message || "Greška pri promeni šifre.");
    }
  }

  return (
    <main style={{ padding: "60px 24px", maxWidth: 550, margin: "0 auto", minHeight: "80vh" }}>
      <h1 style={{ marginBottom: 32, textAlign: "center", color: "#1a202c", fontSize: "2.5rem" }}>Profil</h1>

      <div style={{ backgroundColor: "white", borderRadius: "24px", padding: "40px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", border: "1px solid #f0f0f0" }}>
        
        {/* --- PRIKAZ PODATAKA --- */}
        {!isEditing && !isChangingPass && (
          <div style={{ display: "grid", gap: "24px" }}>
            <div style={{ textAlign: "center" }}>
                <div style={{ width: 80, height: 80, backgroundColor: "#f3e8ff", color: "#6b21a8", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 28, fontWeight: "bold", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>
                    {u.firstName[0]?.toUpperCase()}{u.lastName[0]?.toUpperCase()}
                </div>
                <h2 style={{ margin: 0 }}>{u.firstName} {u.lastName}</h2>
                <span style={{ backgroundColor: "#f3e8ff", color: "#6b21a8", padding: "4px 12px", borderRadius: "20px", fontSize: 12, fontWeight: "700" }}>{u.role}</span>
            </div>

            <div style={{ padding: "20px", backgroundColor: "#f8fafc", borderRadius: "16px" }}>
                <p style={{ margin: "0 0 6px", fontSize: 12, color: "#718096", fontWeight: "600" }}>EMAIL ADRESA (ne može se mijenjati)</p>
                <p style={{ margin: 0, color: "#2d3748" }}>{u.email}</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <Button onClick={() => setIsEditing(true)}>Izmeni lične podatke</Button>
                <button 
                    onClick={() => setIsChangingPass(true)}
                    style={{ background: "none", border: "1px solid #e2e8f0", padding: "10px", borderRadius: "8px", cursor: "pointer", fontSize: "14px", fontWeight: "600", color: "#4a5568" }}
                >
                    Promeni šifru
                </button>
            </div>
          </div>
        )}

        {/* --- MOD ZA IZMJENU IMENA --- */}
        {isEditing && (
          <div style={{ display: "grid", gap: "20px" }}>
            <h3 style={{ margin: 0 }}>Uredi ime i prezime</h3>
            <Input label="Ime" value={firstName} onChange={setFirstName} />
            <Input label="Prezime" value={lastName} onChange={setLastName} />
            <div style={{ display: "flex", gap: "12px", marginTop: "10px" }}>
              <Button onClick={handleUpdateInfo}>Sačuvaj</Button>
              <button onClick={() => setIsEditing(false)} style={{ background: "none", border: "none", color: "#718096", cursor: "pointer", textDecoration: "underline" }}>Otkaži</button>
            </div>
          </div>
        )}

        {/* --- MOD ZA PROMJENU ŠIFRE --- */}
        {isChangingPass && (
          <div style={{ display: "grid", gap: "20px" }}>
            <h3 style={{ margin: 0 }}>Promjena šifre</h3>
            <Input label="Trenutna šifra" type="password" value={oldPassword} onChange={setOldPassword} />
            <Input label="Nova šifra" type="password" value={newPassword} onChange={setNewPassword} />
            <div style={{ display: "flex", gap: "12px", marginTop: "10px" }}>
              <Button onClick={handleChangePassword}>Potvrdi novu šifru</Button>
              <button onClick={() => setIsChangingPass(false)} style={{ background: "none", border: "none", color: "#718096", cursor: "pointer", textDecoration: "underline" }}>Otkaži</button>
            </div>
          </div>
        )}

        {message && <p style={{ textAlign: "center", marginTop: "20px", color: message.includes("✅") || message.includes("🔐") ? "#2f855a" : "#c53030" }}>{message}</p>}
      </div>
    </main>
  );
}