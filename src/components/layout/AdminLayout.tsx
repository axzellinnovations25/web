import type { PropsWithChildren } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  CalendarRange,
  ChartColumnBig,
  LayoutDashboard,
  MessageSquareQuote,
  QrCode,
  Settings,
  ShieldPlus,
  Users,
  Wrench,
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
  { to: "/admin/reviews", label: "Reviews", icon: MessageSquareQuote },
  { to: "/admin/analytics", label: "Analytics", icon: ChartColumnBig },
  { to: "/admin/qr", label: "QR Studio", icon: QrCode },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminLayout({ children }: PropsWithChildren) {
  const { signOut } = useAuth();
  const { clinic } = useClinic();

  return (
    <div className="min-h-screen bg-[#f1f6f8]">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:px-8">
        <aside className="rounded-4xl bg-[#0f172a] p-5 text-white shadow-soft">
          <Link to="/" className="block rounded-3xl bg-white/10 p-4">
            <div className="text-xs uppercase tracking-[0.25em] text-white/60">Clinic Console</div>
            <div className="mt-2 text-2xl font-extrabold">{clinic.name}</div>
          </Link>
          <nav className="mt-6 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/admin"}
                className={({ isActive }) =>
                  classNames(
                    "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white",
                    isActive && "bg-white text-slate-900",
                  )
                }
              >
                <item.icon className="size-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-6">
            <Button variant="secondary" className="w-full" onClick={() => void signOut()}>
              Sign out
            </Button>
          </div>
        </aside>
        <main>{children}</main>
      </div>
    </div>
  );
}
