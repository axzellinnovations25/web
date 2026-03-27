import { type PropsWithChildren, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  CalendarRange,
  ChartColumnBig,
  LayoutDashboard,
  Mailbox,
  Menu,
  MessageSquareQuote,
  QrCode,
  Settings,
  ShieldPlus,
  Users,
  Wrench,
  X,
} from "lucide-react";
import { Button } from "../ui/Button";
import { useAuth } from "../../context/AuthContext";
import { useClinic } from "../../context/ClinicContext";
import { classNames } from "../../utils";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/appointments", label: "Appointments", icon: CalendarRange },
  { to: "/admin/doctors", label: "Doctors", icon: ShieldPlus },
  { to: "/admin/services", label: "Services", icon: Wrench },
  { to: "/admin/patients", label: "Patients", icon: Users },
  { to: "/admin/messages", label: "Messages", icon: Mailbox },
  { to: "/admin/reviews", label: "Reviews", icon: MessageSquareQuote },
  { to: "/admin/analytics", label: "Analytics", icon: ChartColumnBig },
  { to: "/admin/qr", label: "QR Studio", icon: QrCode },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

function SidebarContent({
  clinicName,
  onSignOut,
  onNavClick,
}: {
  clinicName: string;
  onSignOut: () => void;
  onNavClick?: () => void;
}) {
  return (
    <>
      {/* Decorative glow */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-blue-500/15 blur-3xl" />

      {/* Clinic identity */}
      <Link
        to="/"
        onClick={onNavClick}
        className="group relative block rounded-2xl border border-white/10 bg-white/5 p-3.5 transition-all duration-200 hover:border-white/20 hover:bg-white/10"
      >
        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 shadow-lg shadow-blue-500/30 transition-transform duration-200 group-hover:scale-105">
            <LayoutDashboard className="size-4 text-white" />
          </div>
          <div className="min-w-0">
            <div className="text-[9px] font-bold uppercase tracking-widest text-blue-400">Clinic Console</div>
            <div className="truncate text-sm font-extrabold tracking-tight text-white">{clinicName}</div>
          </div>
        </div>
      </Link>

      {/* Navigation */}
      <nav className="mt-5 flex-1 space-y-0.5 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-track]:bg-transparent">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/admin"}
            onClick={onNavClick}
            className={({ isActive }) =>
              classNames(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md shadow-blue-500/20"
                  : "text-slate-400 hover:translate-x-0.5 hover:bg-white/5 hover:text-white",
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={classNames(
                    "size-4 transition-transform duration-200",
                    isActive ? "scale-110 text-white" : "text-slate-500 group-hover:text-blue-400",
                  )}
                />
                <span className="font-semibold">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Sign out */}
      <div className="mt-auto pt-3">
        <Button
          variant="secondary"
          className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 text-slate-300 transition-all duration-200 hover:border-red-500/20 hover:bg-red-500/10 hover:text-red-400"
          onClick={onSignOut}
        >
          <svg className="mr-2 size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign out
        </Button>
      </div>
    </>
  );
}

export function AdminLayout({ children }: PropsWithChildren) {
  const { signOut } = useAuth();
  const { clinic } = useClinic();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[#f1f6f8]">
      {/* ── Desktop sidebar ───────────────────────────────────────────────── */}
      <aside className="relative hidden h-full w-64 shrink-0 flex-col overflow-hidden border-r border-slate-800/40 bg-gradient-to-b from-slate-900 to-slate-950 p-4 text-white shadow-xl lg:flex">
        <SidebarContent
          clinicName={clinic.name}
          onSignOut={() => void signOut()}
        />
      </aside>

      {/* ── Mobile overlay ────────────────────────────────────────────────── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Mobile drawer ─────────────────────────────────────────────────── */}
      <aside
        className={classNames(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col overflow-hidden border-r border-slate-800/40 bg-gradient-to-b from-slate-900 to-slate-950 p-4 text-white shadow-xl transition-transform duration-300 ease-out lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute right-3 top-3 z-10 flex size-8 items-center justify-center rounded-xl bg-white/5 text-slate-400 transition hover:bg-white/10 hover:text-white"
          aria-label="Close menu"
        >
          <X className="size-4" />
        </button>
        <SidebarContent
          clinicName={clinic.name}
          onSignOut={() => void signOut()}
          onNavClick={() => setMobileOpen(false)}
        />
      </aside>

      {/* ── Content area ──────────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile top bar */}
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 shadow-sm lg:hidden">
          <button
            onClick={() => setMobileOpen(true)}
            className="flex size-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition hover:bg-slate-200"
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </button>
          <div className="flex min-w-0 items-center gap-2">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-400">
              <LayoutDashboard className="size-3.5 text-white" />
            </div>
            <span className="truncate text-sm font-extrabold text-slate-900">{clinic.name}</span>
          </div>
          <Link to="/" className="shrink-0 text-xs font-semibold text-slate-400 transition hover:text-slate-700">
            ← Site
          </Link>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
