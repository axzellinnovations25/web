import type { ReactNode } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  MessageCircleMore,
  Phone,
  Stethoscope,
  X,
} from "lucide-react";
import { useClinic } from "../../context/ClinicContext";
import { Button } from "../../components/ui/Button";

export function EmergencyBanner() {
  const { clinic } = useClinic();
  const [visible, setVisible] = useState(true);

  if (!clinic.emergencyBannerEnabled || !visible) return null;

  return (
    <div className="relative z-10 bg-gradient-to-r from-accent2 via-orange-400 to-accent2 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm">
      <span>{clinic.emergencyMessage}</span>
      <button
        onClick={() => setVisible(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 transition hover:text-white"
        aria-label="Dismiss"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}

export function WhatsAppFAB() {
  const { clinic } = useClinic();

  return (
    <a
      href={`https://wa.me/${clinic.whatsapp.replace(/\D/g, "")}`}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 z-50 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_32px_rgba(37,211,102,0.50)] transition-all duration-200 hover:scale-110 hover:shadow-[0_12px_40px_rgba(37,211,102,0.60)]"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircleMore className="size-7" />
    </a>
  );
}

export function PublicPageHero({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <section className="px-4 pb-8 pt-8 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] border border-slate-200/80 bg-gradient-to-br from-white via-white to-[rgba(236,254,255,0.75)] px-8 py-14 shadow-soft sm:px-12 sm:py-16">
        {/* Ambient blobs */}
        <div className="pointer-events-none absolute -right-24 -top-24 size-[420px] rounded-full bg-accent/[0.07] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-1/3 size-[300px] rounded-full bg-accent2/[0.05] blur-3xl" />
        {/* Left accent bar */}
        <div className="absolute bottom-10 left-0 top-10 w-[3px] rounded-r-full bg-gradient-to-b from-accent/70 via-accent/30 to-transparent" />
        {/* Dot grid */}
        <div className="bg-dot-grid pointer-events-none absolute inset-0 opacity-[0.35]" />

        <div className="relative max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/[0.07] px-4 py-1.5">
            <span className="size-1.5 rounded-full bg-accent" />
            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-accent">{eyebrow}</span>
          </div>
          <h1 className="mt-4 text-4xl font-extrabold leading-[1.08] tracking-tight text-ink sm:text-5xl">{title}</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">{description}</p>
          {actions ? <div className="mt-7 flex flex-wrap gap-3">{actions}</div> : null}
        </div>
      </div>
    </section>
  );
}

export function ClinicFooter() {
  const { clinic } = useClinic();
  const navLinks = [
    { label: "Home", to: "/" },
    { label: "About", to: "/about" },
    { label: "Services", to: "/services" },
    { label: "Doctors", to: "/doctors" },
    { label: "Contact", to: "/contact" },
  ];

  return (
    <footer className="bg-gradient-to-b from-slate-950 via-slate-950 to-[#050e1f] px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-2xl bg-accent text-white shadow-sm">
                <Stethoscope className="size-5" />
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">MedBook Pro</div>
                <div className="text-base font-extrabold text-white">{clinic.name}</div>
              </div>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-7 text-slate-400">{clinic.tagline}</p>
            <div className="mt-6 flex gap-2">
              {clinic.socialLinks.facebook ? (
                <a
                  href={clinic.socialLinks.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="flex size-9 items-center justify-center rounded-full bg-white/10 text-slate-400 transition hover:bg-accent hover:text-white"
                  aria-label="Facebook"
                >
                  <Facebook className="size-4" />
                </a>
              ) : null}
              {clinic.socialLinks.instagram ? (
                <a
                  href={clinic.socialLinks.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="flex size-9 items-center justify-center rounded-full bg-white/10 text-slate-400 transition hover:bg-accent hover:text-white"
                  aria-label="Instagram"
                >
                  <Instagram className="size-4" />
                </a>
              ) : null}
              {clinic.socialLinks.linkedin ? (
                <a
                  href={clinic.socialLinks.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="flex size-9 items-center justify-center rounded-full bg-white/10 text-slate-400 transition hover:bg-accent hover:text-white"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="size-4" />
                </a>
              ) : null}
            </div>
          </div>

          <div>
            <div className="text-sm font-bold uppercase tracking-[0.15em] text-white">Navigation</div>
            <ul className="mt-5 space-y-3">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-sm text-slate-400 transition hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/booking" className="text-sm text-slate-400 transition hover:text-white">
                  Book Appointment
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <div className="text-sm font-bold uppercase tracking-[0.15em] text-white">Contact</div>
            <ul className="mt-5 space-y-4">
              <li className="flex items-start gap-2.5 text-sm text-slate-400">
                <Phone className="mt-0.5 size-4 shrink-0 text-accent" />
                {clinic.phone}
              </li>
              <li className="flex items-start gap-2.5 text-sm text-slate-400">
                <Mail className="mt-0.5 size-4 shrink-0 text-accent" />
                {clinic.email}
              </li>
              <li className="flex items-start gap-2.5 text-sm text-slate-400">
                <MapPin className="mt-0.5 size-4 shrink-0 text-accent" />
                {clinic.address}
              </li>
            </ul>
            <Link to="/booking" className="mt-6 inline-flex">
              <Button className="px-5 py-2.5">Book Appointment</Button>
            </Link>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 sm:flex-row">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} {clinic.name}. All rights reserved.
          </p>
          <p className="text-xs text-slate-500">Powered by MedBook Pro</p>
        </div>
      </div>
    </footer>
  );
}
