import React from "react";
import "../styles/modals.css";
interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ open, onClose, children }: ModalProps) {
  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(56, 45, 45, 0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#2a0638",
          padding: 24,
          borderRadius: 12,
          width: "100%",
          maxWidth: 500,
          boxShadow: "0 4px 20px rgba(32, 87, 189, 0.4)",
          
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
