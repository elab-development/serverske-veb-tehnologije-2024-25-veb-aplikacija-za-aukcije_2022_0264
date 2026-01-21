import { NavLink as RouterNavLink } from "react-router-dom";

type NavLinkProps = {
  to: string;
  label: string;
  className?: string;
  end?: boolean;
};

export default function NavLink({ to, label, className = "", end }: NavLinkProps) {
  return (
    <RouterNavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        [
          "nav-link",
          isActive ? "nav-link--active" : "",
          className
        ].join(" ")
      }
    >
      {label}
    </RouterNavLink>
  );
}
