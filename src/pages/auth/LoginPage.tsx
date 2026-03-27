import { useState } from "react";
import { Navigate } from "react-router-dom";
import { CheckCircle2, Stethoscope } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";

const features = [
  "Real-time appointment management",
  "Patient records & prescriptions",
  "Analytics & performance insights",
  "QR code booking system",
  "Review moderation",
];

export function LoginPage() {
  const { signIn, isAuthenticated, userRole } = useAuth();
  const [email, setEmail] = useState("admin@medbookpro.demo");
  const [password, setPassword] = useState("password");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to={userRole === "doctor" ? "/doctor" : "/admin"} replace />;

  return (
    <div className="flex min-h-screen">
      {/* Left — branding panel */}
      <div className="hidden flex-col justify-between bg-[#0f172a] p-12 lg:flex lg:w-[44%]">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-accent text-white shadow-sm">
            <Stethoscope className="size-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/40">
              MedBook Pro
            </div>
            <div className="text-base font-extrabold text-white">Admin Console</div>
          </div>
        </div>

        {/* Hero copy */}
        <div>
          <h1 className="text-4xl font-extrabold leading-tight text-white">
            Your clinic,
            <br />
            fully in control.
          </h1>
          <p className="mt-4 max-w-sm text-sm leading-7 text-white/50">
            Manage appointments, patients, doctors, analytics, and everything in between from one
            powerful dashboard.
          </p>

          {/* Feature list */}
          <ul className="mt-10 space-y-3.5">
            {features.map((f) => (
              <li key={f} className="flex items-center gap-3 text-sm text-white/70">
                <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-accent/20">
                  <CheckCircle2 className="size-3.5 text-accent" />
                </div>
                {f}
              </li>
            ))}
          </ul>
        </div>

        <div className="text-xs text-white/25">
          MedBook Pro v1.0 &copy; {new Date().getFullYear()}
        </div>
      </div>

      {/* Right — login form */}
      <div className="flex flex-1 items-center justify-center bg-canvas px-6 py-14">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="mb-10 flex items-center gap-3 lg:hidden">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-accent text-white shadow-sm">
              <Stethoscope className="size-5" />
            </div>
            <div className="text-xl font-extrabold text-ink">MedBook Pro Admin</div>
          </div>

          <h2 className="text-3xl font-extrabold text-ink">Welcome back</h2>
          <p className="mt-2 text-sm text-slate-500">
            Sign in to access the clinic management console.
          </p>

          <div className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-semibold text-slate-700"
              >
                Email address
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@clinic.com"
                autoComplete="email"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-semibold text-slate-700"
              >
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (!loading) {
                      setLoading(true);
                      void signIn(email, password).then((result) => {
                        setLoading(false);
                        setError(result.error ?? null);
                      });
                    }
                  }
                }}
              />
            </div>

            {error && (
              <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                {error}
              </div>
            )}

            <Button
              className="w-full py-3.5 text-[15px]"
              disabled={loading || !email || !password}
              onClick={() => {
                setLoading(true);
                void signIn(email, password).then((result) => {
                  setLoading(false);
                  setError(result.error ?? null);
                });
              }}
            >
              {loading ? "Signing in…" : "Sign In"}
            </Button>
          </div>

          <p className="mt-8 text-center text-xs text-slate-400">
            Demo credentials pre-filled &mdash; just click Sign In.
          </p>
        </div>
      </div>
    </div>
  );
}
