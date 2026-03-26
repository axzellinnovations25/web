import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";

export function LoginPage() {
  const { signIn, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("admin@medbookpro.demo");
  const [password, setPassword] = useState("password");
  const [error, setError] = useState<string | null>(null);

  if (isAuthenticated) return <Navigate to="/admin" replace />;

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <h1 className="text-3xl font-extrabold">Admin Login</h1>
        <p className="mt-2 text-slate-600">Uses Supabase auth when environment variables are configured.</p>
        <div className="mt-6 space-y-4">
          <Input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" />
          <Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" />
          {error ? <div className="text-sm text-rose-600">{error}</div> : null}
          <Button
            className="w-full"
            onClick={async () => {
              const result = await signIn(email, password);
              setError(result.error ?? null);
            }}
          >
            Sign In
          </Button>
        </div>
      </Card>
    </div>
  );
}
