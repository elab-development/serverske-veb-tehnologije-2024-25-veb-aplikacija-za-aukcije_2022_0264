import { NavLink as RouterNavLink } from "react-router-dom";
import "../styles/navlink.css";
type NavLinkProps = {
  to: string;
  label: string;
  className?: string;
  end?: boolean;
  mode?:"light" | "dark"
};

export default function NavLink({ to, label, className = "", end, mode="light"}: NavLinkProps) {
  return (
    <RouterNavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        [
          "nav-link",
          "nav-link--${mode}",
          isActive ? "nav-link--active" : "",
          className
        ].join(" ")
      }
    >
      {label}
    </RouterNavLink>
  );
}
