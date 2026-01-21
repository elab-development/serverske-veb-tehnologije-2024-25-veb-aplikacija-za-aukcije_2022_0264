import React from "react";
import "../styles/footer.css";
type FooterProps = {
  brandName?: string;
  note?: string; //
  className?: string;
};

export default function Footer({
  brandName = "Online Aukcije",
  note = "Copyright",
  className = "footer",
}: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer
      className={[
        "footer",
        className,
      ].join(" ")}
    >
      <div className="footer">
        <p className="text-center text-sm text-black/60">
          {note}  ©  {year} <span className="font-medium text-black/80">{brandName}</span>{" "}
          
        </p>
      </div>
    </footer>
  );
}
