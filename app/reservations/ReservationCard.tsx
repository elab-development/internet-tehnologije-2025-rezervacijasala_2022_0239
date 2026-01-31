"use client";

import { useMemo, useState } from "react";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";
import { diffHours } from "@/lib/time";
import { Reservation } from "./page";
import { canModifyOrCancel, fmtDateTimeSR, statusLabel } from "./reservationUtils";
import ConfirmModal from "@/components/Confirm"; // <-- prilagodi putanju ako ti je drugačija

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

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [busy, setBusy] = useState(false);

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

  async function doCancel() {
    if (!user) return;

    try {
      setBusy(true);
      await apiFetch(`/api/reservations/${reservation.id}`, { method: "DELETE" });
      setConfirmOpen(false);
      onChanged();
    } catch (e: any) {
      alert(e?.message || "Greška pri otkazivanju");
      setConfirmOpen(false);
    } finally {
      setBusy(false);
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
            <strong style={{ color: "var(--text-main)" }}>Broj gostiju:</strong>{" "}
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

      <div
        style={{
          display: "flex",
          gap: 10,
          justifyContent: "flex-end",
          flexWrap: "wrap",
        }}
      >
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
          onClick={() => {
            if (!canAction) return;
            setConfirmOpen(true); // ✅ umjesto confirm()
          }}
          disabled={!canAction || busy}
          style={{
            opacity: canAction && !busy ? 1 : 0.5,
            cursor: canAction && !busy ? "pointer" : "not-allowed",
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

      {/* ✅ Lijepi confirm modal */}
      <ConfirmModal
        open={confirmOpen}
        title="Otkaži rezervaciju"
        message="Da li sigurno želiš da otkažeš rezervaciju?"
        confirmText={busy ? "Brisanje..." : "Otkaži"}
        confirmVariant="danger"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={doCancel}
      />
    </div>
  );
}
