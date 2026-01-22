"use client";

type ConfirmModalProps = {
  open: boolean;
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({
  open,
  title = "Potvrda",
  message,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "#fff7f0",
          borderRadius: 12,
          padding: 20,
          width: 360,
          boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
        }}
      >
        <h3 style={{ marginTop: 0 }}>{title}</h3>
        <p>{message}</p>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
            marginTop: 20,
          }}
        >
          <button onClick={onCancel}>Otkaži</button>
          <button
            onClick={onConfirm}
            style={{
              background: "#a33",
              color: "white",
              borderRadius: 8,
              padding: "6px 14px",
            }}
          >
            Obriši
          </button>
        </div>
      </div>
    </div>
  );
}
