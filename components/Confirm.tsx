"use client";

import type { ReactNode } from "react";

type ConfirmModalProps = {
  open: boolean;
  title?: string;

  // umesto string, može i JSX
  message: ReactNode;

  onConfirm: () => void;
  onCancel: () => void;

  // dodatno
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: "danger" | "primary";
  disabled?: boolean;
  closeOnBackdrop?: boolean;
};

export default function ConfirmModal({
  open,
  title = "Potvrda",
  message,
  onConfirm,
  onCancel,
  confirmText = "Potvrdi",
  cancelText = "Otkaži",
  confirmVariant = "primary",
  disabled = false,
  closeOnBackdrop = true,
}: ConfirmModalProps) {
  if (!open) return null;

  const confirmStyle =
    confirmVariant === "danger"
      ? { background: "#a33", color: "white" }
      : { background: "#2b6cb0", color: "white" };

  return (
    <div
      onClick={() => {
        if (closeOnBackdrop && !disabled) onCancel();
      }}
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
        onClick={(e) => e.stopPropagation()} // da klik unutar modala ne zatvara
        style={{
          background: "#fff7f0",
          borderRadius: 12,
          padding: 20,
          width: 420,
          boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
        }}
      >
        <h3 style={{ marginTop: 0 }}>{title}</h3>

        {/* message može biti string ili JSX */}
        <div style={{ marginTop: 8 }}>{message}</div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
            marginTop: 20,
          }}
        >
          <button onClick={onCancel} disabled={disabled}>
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            disabled={disabled}
            style={{
              ...confirmStyle,
              borderRadius: 8,
              padding: "6px 14px",
              opacity: disabled ? 0.7 : 1,
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
