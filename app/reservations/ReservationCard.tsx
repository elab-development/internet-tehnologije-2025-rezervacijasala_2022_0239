"use client";

import { apiFetch } from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";
import { Reservation } from "./page";
import { canModifyOrCancel, fmtDateTimeSR, statusLabel } from "./reservationUtils";

export default function ReservationCard({
  reservation,
  isPrivileged,
  onEdit,
  onChanged,
}: {
  reservation: Reservation;
  isPrivileged: boolean;
  onEdit: () => void;
  onChanged: () => void;
}) {
  const { user } = useAuth();

  const canAction =
    reservation.status === "ACTIVE" && canModifyOrCancel(reservation.startDateTime);

  async function cancel() {
    if (!user) return;

    if (!canAction) {
      alert("Izmjena/otkazivanje je moguće samo do 15 dana prije termina.");
      return;
    }

    const ok = confirm("Da li sigurno želiš da otkažeš rezervaciju?");
    if (!ok) return;

    try {
      await apiFetch(
        `/api/reservations/${reservation.id}`,
        { method: "DELETE" },
        { user }
      );
      onChanged();
    } catch (e: any) {
      alert(e?.message || "Greška pri otkazivanju");
    }
  }

  return (
    <div className="card" style={{ display: "grid", gap: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <div style={{ display: "grid", gap: 6 }}>
          <div style={{ fontWeight: 900, fontSize: 18 }}>
            Sala: {reservation.hall.name}
          </div>

          {isPrivileged && reservation.user && (
            <div style={{ fontSize: 14, color: "var(--text-muted)" }}>
              Rezervisao:{" "}
              <strong style={{ color: "var(--text-main)" }}>
                {(reservation.user.firstName || "") + " " + (reservation.user.lastName || "")}
              </strong>
            </div>
          )}

          <div style={{ color: "var(--text-muted)" }}>
            <strong style={{ color: "var(--text-main)" }}>Od:</strong>{" "}
            {fmtDateTimeSR(reservation.startDateTime)}
          </div>
          <div style={{ color: "var(--text-muted)" }}>
            <strong style={{ color: "var(--text-main)" }}>Do:</strong>{" "}
            {fmtDateTimeSR(reservation.endDateTime)}
          </div>
          <div style={{ color: "var(--text-muted)" }}>
            <strong style={{ color: "var(--text-main)" }}>Broj gostiju:</strong>{" "}
            {reservation.numberOfGuests}
          </div>

          <div style={{ fontSize: 14, color: "var(--text-muted)" }}>
            <strong style={{ color: "var(--text-main)" }}>Status:</strong>{" "}
            {statusLabel(reservation.status)}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", flexWrap: "wrap" }}>
        <button
          type="button"
          onClick={onEdit}
          disabled={!canAction}
          style={{ opacity: canAction ? 1 : 0.5, cursor: canAction ? "pointer" : "not-allowed" }}
        >
          Izmijeni
        </button>

        <button
          type="button"
          onClick={cancel}
          disabled={!canAction}
          style={{ opacity: canAction ? 1 : 0.5, cursor: canAction ? "pointer" : "not-allowed" }}
        >
          Otkaži
        </button>
      </div>

      {reservation.status === "ACTIVE" && !canModifyOrCancel(reservation.startDateTime) && (
        <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
          Izmjena/otkazivanje je moguće samo do <strong>15 dana</strong> prije termina.
        </div>
      )}
    </div>
  );
}
