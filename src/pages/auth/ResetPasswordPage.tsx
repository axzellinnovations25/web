import { Card } from "../../components/ui/Card";

export function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="max-w-lg">
        <h1 className="text-3xl font-extrabold">Password Reset</h1>
        <p className="mt-3 text-slate-600">
          Hook this route to Supabase password recovery once your project URL and anon key are configured.
        </p>
      </Card>
    </div>
  );
}
