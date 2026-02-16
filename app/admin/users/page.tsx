"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { apiFetch } from "@/lib/api";
import Button from "../../../components/Button";
import ConfirmModal from "../../../components/Confirm";

type Role = "USER" | "MANAGER" | "ADMIN";

type UserRow = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
};

type EditState = {
  id: number;
  firstName: string;
  lastName: string;
  role: Role;
};

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();

  const [users, setUsers] = useState<UserRow[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [confirmUserId, setConfirmUserId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);


  const [editing, setEditing] = useState<EditState | null>(null);
  const [saving, setSaving] = useState(false);


  const [pwUserId, setPwUserId] = useState<number | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [pwSaving, setPwSaving] = useState(false);

  const roleOptions: Role[] = useMemo(() => ["USER", "MANAGER", "ADMIN"], []);

  useEffect(() => {
    if (!currentUser || currentUser.role !== "ADMIN") {
      setLoading(false);
      return;
    }

    setLoading(true);
    setMessage(null);

    apiFetch("/api/users")
      .then((data) => {
        const normalized: UserRow[] = (data ?? []).map((u: any) => ({
          id: u.id,
          email: u.email,
          firstName: u.firstName ?? "",
          lastName: u.lastName ?? "",
          role: (typeof u.role === "string" ? u.role : u.role?.name) as Role,
        }));
        setUsers(normalized);
      })
      .catch((err) =>
        setMessage(err.message || "Greška pri učitavanju korisnika")
      )
      .finally(() => setLoading(false));
  }, [currentUser]);

  if (!currentUser) return null;

  if (currentUser.role !== "ADMIN") {
    return (
      <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
        <h1>Admin - Korisnici</h1>
        <p>Nemaš pristup ovoj stranici.</p>
      </main>
    );
  }

  function startEdit(u: UserRow) {
    setMessage(null);
    setEditing({
      id: u.id,
      firstName: u.firstName,
      lastName: u.lastName,
      role: u.role,
    });
  }

  function cancelEdit() {
    setEditing(null);
  }

  async function saveEdit() {
    if (!editing) return;

    if (!editing.firstName.trim() || !editing.lastName.trim()) {
      setMessage("Ime i prezime su obavezni.");
      return;
    }

    try {
      setSaving(true);
      setMessage(null);

      const updated = await apiFetch(`/api/users/${editing.id}`, {
        method: "PUT",
        body: JSON.stringify({
          firstName: editing.firstName.trim(),
          lastName: editing.lastName.trim(),
          role: editing.role, 
        }),
      });

      const updatedRole = (typeof updated.role === "string"
        ? updated.role
        : updated.role?.name) as Role;

      setUsers((prev) =>
        prev.map((u) =>
          u.id === editing.id
            ? {
                ...u,
                firstName: updated.firstName ?? editing.firstName,
                lastName: updated.lastName ?? editing.lastName,
                role: updatedRole ?? editing.role,
              }
            : u
        )
      );

      setEditing(null);
    } catch (err: any) {
      setMessage(err.message || "Greška pri čuvanju izmjena");
    } finally {
      setSaving(false);
    }
  }

  function openPasswordReset(userId: number) {
    setMessage(null);
    setPwUserId(userId);
    setNewPassword("");
  }

  function closePasswordReset() {
    setPwUserId(null);
    setNewPassword("");
  }

  async function resetPassword() {
    if (pwUserId == null) return;

    if (newPassword.trim().length < 6) {
      setMessage("Nova lozinka mora imati najmanje 6 karaktera.");
      return;
    }

    try {
      setPwSaving(true);
      setMessage(null);


      await apiFetch(`/api/users/${pwUserId}/password`, {
        method: "PUT",
        body: JSON.stringify({ newPassword: newPassword.trim() }),
      });

      const targetUser = users.find(u => u.id === pwUserId);

      if (targetUser) {

        await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: targetUser.email,
            subject: "Reset lozinke - Restoran Ljubičica",
            html: `
              Poštovani ${targetUser.firstName}, 
              Administrator je promenio Vašu lozinku. 
              Nova lozinka je: ${newPassword.trim()}
            `
          }),
        });
      }

      closePasswordReset();
      setMessage(`Lozinka za korisnika ${targetUser?.email} je uspešno promijenjena i obaveštenje je poslato.`);
    } catch (err: any) {
      setMessage(err.message || "Greška pri promjeni lozinke");
    } finally {
      setPwSaving(false);
    }
  }

  async function confirmDeleteUser() {
    if (confirmUserId == null) return;

    try {
      setDeleting(true);
      setMessage(null);

      await apiFetch(`/api/users/${confirmUserId}`, { method: "DELETE" });

      setUsers((prev) => prev.filter((u) => u.id !== confirmUserId));
      setConfirmUserId(null);

      setEditing((prev) => (prev?.id === confirmUserId ? null : prev));
    } catch (err: any) {
      setMessage(err.message || "Greška pri brisanju korisnika");
      setConfirmUserId(null);
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return <p style={{ padding: 24 }}>Učitavanje korisnika...</p>;
  }

  return (
    <main style={{ padding: 24, maxWidth: 900, margin: "0 auto",}}>
      <h1>Upravljanje korisnicima</h1>

      {message && <p style={{ fontSize: 14, marginTop: 8 }}>{message}</p>}

      {users.length === 0 ? (
        <p>Nema korisnika u sistemu.</p>
      ) : (
        <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
          {users.map((u) => {
            const isEditingThis = editing?.id === u.id;

            return (
              <div
                key={u.id}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: 12,
                  padding: 14,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 16,
                }}
              >
                {/* LEFT */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700 }}>{u.email}</div>

                  {!isEditingThis ? (
                    <>
                      <div style={{ fontSize: 14, opacity: 0.8 }}>
                        Ime: {u.firstName} {u.lastName}
                      </div>
                      <div style={{ fontSize: 14, opacity: 0.8 }}>
                        Uloga: {u.role}
                      </div>
                    </>
                  ) : (
                    <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
                      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                        <div style={{ display: "grid", gap: 4 }}>
                          <label style={{ fontSize: 12, opacity: 0.75 }}>
                            Ime
                          </label>
                          <input
                            value={editing.firstName}
                            onChange={(e) =>
                              setEditing((prev) =>
                                prev ? { ...prev, firstName: e.target.value } : prev
                              )
                            }
                            style={{
                              padding: "10px 12px",
                              border: "1px solid #e5e7eb",
                              borderRadius: 10,
                              minWidth: 200,
                            }}
                          />
                        </div>

                        <div style={{ display: "grid", gap: 4 }}>
                          <label style={{ fontSize: 12, opacity: 0.75 }}>
                            Prezime
                          </label>
                          <input
                            value={editing.lastName}
                            onChange={(e) =>
                              setEditing((prev) =>
                                prev ? { ...prev, lastName: e.target.value } : prev
                              )
                            }
                            style={{
                              padding: "10px 12px",
                              border: "1px solid #e5e7eb",
                              borderRadius: 10,
                              minWidth: 200,
                            }}
                          />
                        </div>

                        <div style={{ display: "grid", gap: 4 }}>
                          <label style={{ fontSize: 12, opacity: 0.75 }}>
                            Uloga
                          </label>
                          <select
                            value={editing.role}
                            onChange={(e) =>
                              setEditing((prev) =>
                                prev ? { ...prev, role: e.target.value as Role } : prev
                              )
                            }
                            style={{
                              padding: "10px 12px",
                              border: "1px solid #e5e7eb",
                              borderRadius: 10,
                              minWidth: 180,
                              background: "white",
                            }}
                          >
                            {roleOptions.map((r) => (
                              <option key={r} value={r}>
                                {r}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: 10 }}>
                        <Button type="button" onClick={saveEdit} disabled={saving}>
                          {saving ? "Čuvanje..." : "Sačuvaj"}
                        </Button>
                        <Button type="button" onClick={cancelEdit} disabled={saving}>
                          Otkaži
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  {!isEditingThis ? (
                    <>
                      <Button type="button" onClick={() => startEdit(u)}>
                        Izmeni
                      </Button>

                      <Button
                        type="button"
                        onClick={() => openPasswordReset(u.id)}
                        disabled={u.id === currentUser.id}
                      >
                        Reset lozinke
                      </Button>

                      <Button
                        type="button"
                        onClick={() => setConfirmUserId(u.id)}
                        disabled={u.id === currentUser.id}
                      >
                        Obriši
                      </Button>
                    </>
                  ) : (
                    <Button type="button" onClick={cancelEdit} disabled={saving}>
                      Zatvori
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}


      <ConfirmModal
        open={confirmUserId !== null}
        title="Brisanje korisnika"
        message="Da li si siguran da želiš da obrišeš korisnika?"
        confirmText={deleting ? "Brisanje..." : "Obriši"}
        confirmVariant="danger"
        disabled={deleting}
        onCancel={() => setConfirmUserId(null)}
        onConfirm={confirmDeleteUser}
      />


      <ConfirmModal
        open={pwUserId !== null}
        title="Reset lozinke"
        message={
          <div style={{ display: "grid", gap: 10 }}>
            <p style={{ margin: 0, fontSize: 14 }}>
              Unesi novu lozinku (min 6 karaktera).
            </p>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Nova lozinka"
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #e5e7eb",
                borderRadius: 10,
              }}
            />
          </div>
        }
        confirmText={pwSaving ? "Čuvanje..." : "Sačuvaj"}
        confirmVariant="primary"
        disabled={pwSaving}
        onCancel={closePasswordReset}
        onConfirm={resetPassword}
      />
    </main>
  );
}
