import React from "react";
import "../styles/footer.css";
import NavLink from "./NavLink";
type FooterProps = {
  brandName?: string;
  note?: string; //
  className?: string;
};

export default function Footer({
  brandName = "Online Aukcije",
  note = "Copyright",
}: FooterProps) {
  const year = new Date().getFullYear();

  return (

    <div className="footer2">

      <div className="footer-wrapper">
        <div className="footer-links">
          <NavLink to="/mogucnosti" label="External API" className="white" />
          <NavLink to="/categories" label="Kategorije" className="white" />
          <NavLink to="/products" label="Proizvodi" mode="dark" className="white" />
        </div>
        <div className="footer-links">
          
          <NavLink to="/ourteam" label="Nas tim" className="white" />
          <NavLink to="/active-auctions" label="Aukcije" className="white" />
          
        </div>
        <div className="contact-div">
            <p className="p10">Ukoliko imate nekih pitanja, kontaktirajte nas!</p>
            <div className="email-contanct">
              <p className="p101">email : onlineaukcije@bidx.com</p>
              <p className="p101">kontakt : 060300300</p>
              </div>
        </div>

      </div>
      <div className="copyright-footer">
        <p className="footerp">
          {note}  ©  {year} <span className="footerp1">{brandName}</span>{" "}

        </p>
      </div>

    </div>
  );
}
