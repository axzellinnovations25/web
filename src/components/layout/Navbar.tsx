import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, Phone, Stethoscope, X } from "lucide-react";
import { useClinic } from "../../context/ClinicContext";
import { Button } from "../ui/Button";
import { classNames } from "../../utils";

const links = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Services", to: "/services" },
  { label: "Doctors", to: "/doctors" },
  { label: "Contact", to: "/contact" },
];

export function Navbar() {
  const { clinic } = useClinic();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    const handler = () => {
      if (window.innerWidth >= 768) setOpen(false);
    };

    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  return (
    <>
      <header
        className={classNames(
          "sticky top-0 z-40 transition-all duration-300",
          scrolled
            ? "border-b border-slate-200/60 bg-white/96 shadow-[0_4px_24px_rgba(15,23,42,0.08)] backdrop-blur-xl"
            : "border-b border-transparent bg-canvas/85 backdrop-blur-md",
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
            <div className="flex size-10 items-center justify-center rounded-2xl bg-accent text-white shadow-sm">
              <Stethoscope className="size-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted">MedBook Pro</div>
              <div className="text-[15px] font-extrabold leading-tight text-ink">{clinic.name}</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {links.map((link) => (
              <NavLink
                key={link.label}
                to={link.to}
                className={({ isActive }) =>
                  classNames(
                    "rounded-full px-4 py-2 text-sm font-semibold transition-colors hover:bg-slate-100",
                    isActive ? "bg-slate-100 text-ink" : "text-slate-600 hover:text-ink",
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
            <div className="mx-2 h-5 w-px bg-slate-200" />
            <a
              href={`tel:${clinic.phone}`}
              className="hidden items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-ink xl:flex"
            >
              <Phone className="size-3.5" />
              {clinic.phone}
            </a>
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                classNames(
                  "rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-ink",
                  isActive && "text-ink",
                )
              }
            >
              Admin
            </NavLink>
            <Link to="/booking" className="ml-1">
              <Button className="px-5 py-2.5">Book Appointment</Button>
            </Link>
          </nav>

          <div className="flex items-center gap-2 md:hidden">
            <Link to="/booking">
              <Button className="!px-4 !py-2 text-xs">Book Now</Button>
            </Link>
            <button
              onClick={() => setOpen((value) => !value)}
              className="flex size-10 items-center justify-center rounded-2xl bg-white text-ink shadow-sm ring-1 ring-slate-200 transition"
              aria-label={open ? "Close menu" : "Open menu"}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </header>

      {open ? (
        <div className="fixed inset-0 z-30 bg-slate-900/20 backdrop-blur-sm md:hidden" onClick={() => setOpen(false)} />
      ) : null}

      <div
        className={classNames(
          "fixed inset-x-0 top-0 z-40 origin-top transform transition-all duration-300 ease-out md:hidden",
          open ? "scale-y-100 opacity-100" : "pointer-events-none scale-y-95 opacity-0",
        )}
      >
        <div className="rounded-b-[2rem] bg-white px-6 pb-8 pt-[72px] shadow-soft ring-1 ring-slate-100">
          <nav className="space-y-1">
            {links.map((link) => (
              <NavLink
                key={link.label}
                to={link.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  classNames(
                    "flex items-center rounded-2xl px-4 py-3.5 text-base font-semibold transition hover:bg-canvas",
                    isActive ? "text-accent" : "text-slate-700",
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
            <NavLink
              to="/admin"
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                classNames(
                  "flex items-center rounded-2xl px-4 py-3.5 text-base font-semibold transition hover:bg-canvas",
                  isActive ? "text-accent" : "text-slate-700",
                )
              }
            >
              Admin Panel
            </NavLink>
          </nav>
          <div className="mt-5 border-t border-slate-100 pt-5">
            <a
              href={`tel:${clinic.phone}`}
              className="flex items-center gap-3 rounded-2xl bg-canvas px-4 py-3.5 text-sm font-semibold text-slate-600"
            >
              <Phone className="size-4 text-accent" />
              {clinic.phone}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
