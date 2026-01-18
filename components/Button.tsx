type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
};

export default function Button({
  children,
  onClick,
  type = "button",
  disabled = false,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "10px 14px",
        borderRadius: 10,
        border: "1px solid #e5e7eb",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
        fontWeight: 600,
      }}
    >
      {children}
    </button>
  );
}
