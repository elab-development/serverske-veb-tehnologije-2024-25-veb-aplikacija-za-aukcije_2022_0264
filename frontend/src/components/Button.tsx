import React from "react";
import "../styles/button.css";
type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  variant?: "primary" | "secondary" | "link" |"thirdary" |"secondary2";
  className?: string;
};

export default function Button({
  children,
  onClick,
  type = "button",
  disabled = false,
  variant = "primary",
  className = "",
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`ui-btn ui-btn--${variant} ${className}`.trim()}
    >
      {children}
    </button>
  );
}
