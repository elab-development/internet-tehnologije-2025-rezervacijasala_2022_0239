"use client";

import { useMemo } from "react";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";
import { diffHours } from "@/lib/time";
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
    reservation.status === "ACTIVE" &&
    canModifyOrCancel(reservation.startDateTime);

  const durationHours = useMemo(() => {
    const h = diffHours(reservation.startDateTime, reservation.endDateTime);
    return h > 0 ? h : 0;
  }, [reservation.startDateTime, reservation.endDateTime]);

  const totalPrice = useMemo(() => {
    const pricePerHour = reservation.hall?.pricePerHour ?? 0;
    if (durationHours <= 0 || pricePerHour <= 0) return 0;
    return durationHours * pricePerHour;
  }, [durationHours, reservation.hall?.pricePerHour]);

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
                {(reservation.user.firstName || "") +
                  " " +
                  (reservation.user.lastName || "")}
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
            <strong style={{ color: "var(--text-main)" }}>
              Broj gostiju:
            </strong>{" "}
            {reservation.numberOfGuests}
          </div>

          <div style={{ color: "var(--text-muted)" }}>
            <strong style={{ color: "var(--text-main)" }}>Ukupno:</strong>{" "}
            {totalPrice.toFixed(2)} €
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
          style={{
            opacity: canAction ? 1 : 0.5,
            cursor: canAction ? "pointer" : "not-allowed",
          }}
        >
          Izmijeni
        </button>

        <button
          type="button"
          onClick={cancel}
          disabled={!canAction}
          style={{
            opacity: canAction ? 1 : 0.5,
            cursor: canAction ? "pointer" : "not-allowed",
          }}
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
