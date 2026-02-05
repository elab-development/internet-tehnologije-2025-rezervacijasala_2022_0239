"use client";

import { useMemo, useState } from "react";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";
import { diffHours } from "@/lib/time";
import { Reservation } from "./page";
import {
  canModifyOrCancel,
  fmtDateTimeSR,
  statusLabel,
} from "./reservationUtils";
import ConfirmModal from "@/components/Confirm";
import Button from "@/components/Button";
import { useCurrency } from "@/lib/CurrencyContext";

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
  const { convertPrice } = useCurrency();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  // LOGIKA ZA AKCIJE (Izmena/Otkazivanje dozvoljeno samo ako je ACTIVE i na vreme)
  const canAction =
    reservation.status === "ACTIVE" &&
    canModifyOrCancel(reservation.startDateTime);

  const durationHours = useMemo(() => {
    const h = diffHours(
      reservation.startDateTime,
      reservation.endDateTime
    );
    return h > 0 ? h : 0;
  }, [reservation.startDateTime, reservation.endDateTime]);

  const totalPrice = useMemo(() => {
    const pricePerHour = reservation.hall?.pricePerHour ?? 0;
    if (durationHours <= 0 || pricePerHour <= 0) return 0;
    return durationHours * pricePerHour;
  }, [durationHours, reservation.hall?.pricePerHour]);

  // FUNKCIJA ZA ODOBRAVANJE / ODBIJANJE (Samo za Manager/Admin)
  async function handleStatusUpdate(newStatus: "ACTIVE" | "CANCELLED") {
    try {
      setBusy(true);
      // 1. Ažuriramo status u bazi (napravi ovu rutu na backendu ili koristi postojeću PUT rutu)
      await apiFetch(`/api/reservations/${reservation.id}`, {
        method: "PUT",
        body: JSON.stringify({ status: newStatus }),
      });

      // 2. Šaljemo mejl korisniku o odluci
      const subject = newStatus === "ACTIVE" ? "Rezervacija ODOBRENA" : "Rezervacija odbijena";
      const message = newStatus === "ACTIVE" 
        ? `Vaša rezervacija za salu <strong>${reservation.hall.name}</strong> je odobrena! Vidimo se.`
        : `Nažalost, vaša rezervacija za salu <strong>${reservation.hall.name}</strong> je odbijena/otkazana.`;

      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: reservation.user?.email, // Nadamo se da je email tu
          subject: subject,
          html: message
        }),
      });

      onChanged(); // Osveži listu
    } catch (e: any) {
      alert("Greška: " + e.message);
    } finally {
      setBusy(false);
    }
  }

  async function doCancel() {
    if (!user) return;
    try {
      setBusy(true);
      await apiFetch(`/api/reservations/${reservation.id}`, {
        method: "DELETE",
      });
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
    <div className="card" style={{ display: "grid", gap: 10, borderLeft: reservation.status === 'PENDING' ? '5px solid orange' : 'none' }}>
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
            <strong style={{ color: "var(--text-main)" }}>Od:</strong> {fmtDateTimeSR(reservation.startDateTime)}
          </div>
          <div style={{ color: "var(--text-muted)" }}>
            <strong style={{ color: "var(--text-main)" }}>Do:</strong> {fmtDateTimeSR(reservation.endDateTime)}
          </div>
          <div style={{ color: "var(--text-muted)" }}>
            <strong style={{ color: "var(--text-main)" }}>Ukupno:</strong> {convertPrice(totalPrice)}
          </div>

          <div style={{ fontSize: 14, color: "var(--text-muted)" }}>
            <strong style={{ color: "var(--text-main)" }}>Status:</strong>{" "}
            <span style={{ 
              color: reservation.status === 'PENDING' ? 'orange' : 
                     reservation.status === 'ACTIVE' ? 'green' : 'red',
              fontWeight: 'bold'
            }}>
              {statusLabel(reservation.status)}
            </span>
          </div>
        </div>
      </div>

      {/* AKCIJE */}
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", flexWrap: "wrap", marginTop: 10 }}>
        
        {/* NOVO: Dugmići za menadžera ako je na čekanju */}
        {isPrivileged && reservation.status === "PENDING" && (
          <>
            <Button onClick={() => handleStatusUpdate("ACTIVE")} disabled={busy}>
              Odobri
            </Button>
            <Button onClick={() => handleStatusUpdate("CANCELLED")} disabled={busy}>
              Odbij
            </Button>
          </>
        )}

        {/* Standardne akcije */}
        <Button onClick={onEdit} disabled={!canAction || busy}>
          Izmeni
        </Button>

        <Button
          onClick={() => {
            if (!canAction) return;
            setConfirmOpen(true);
          }}
          disabled={!canAction || busy}
        >
          Otkaži
        </Button>
      </div>

      {reservation.status === "ACTIVE" && !canModifyOrCancel(reservation.startDateTime) && (
        <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
          Izmena/otkazivanje je moguće samo do 15 dana pre termina.
        </div>
      )}

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