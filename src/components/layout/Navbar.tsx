import { Link, NavLink } from "react-router-dom";
import { Menu, Stethoscope } from "lucide-react";
import { useClinic } from "../../context/ClinicContext";
import { Button } from "../ui/Button";
import { classNames } from "../../utils";

const links = [
  { label: "Services", href: "#services" },
  { label: "Doctors", href: "#doctors" },
  { label: "Reviews", href: "#reviews" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const { clinic } = useClinic();
  return (
    <header className="sticky top-0 z-30 border-b border-white/60 bg-canvas/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-accent text-white">
            <Stethoscope className="size-5" />
          </div>
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.2em] text-muted">MedBook Pro</div>
            <div className="text-lg font-extrabold">{clinic.name}</div>
          </div>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <a key={link.label} href={link.href} className="text-sm font-semibold text-slate-600 hover:text-ink">
              {link.label}
            </a>
          ))}
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              classNames("text-sm font-semibold text-slate-600 hover:text-ink", isActive && "text-ink")
            }
          >
            Admin
          </NavLink>
          <Link to="/booking">
            <Button>Book Now</Button>
          </Link>
        </nav>
        <Link
          to="/booking"
          className="inline-flex rounded-full bg-accent p-3 text-white md:hidden"
          aria-label="Open booking"
        >
          <Menu className="size-5" />
        </Link>
      </div>
    </header>
  );
}
