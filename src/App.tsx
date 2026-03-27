import { lazy, Suspense } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { AdminLayout } from "./components/layout/AdminLayout";
import { Navbar } from "./components/layout/Navbar";
import { useAuth } from "./context/AuthContext";

const LandingPage = lazy(() => import("./pages/public/LandingPage").then((module) => ({ default: module.LandingPage })));
const AboutPage = lazy(() => import("./pages/public/AboutPage").then((module) => ({ default: module.AboutPage })));
const BookingPage = lazy(() => import("./pages/public/BookingPage").then((module) => ({ default: module.BookingPage })));
const ServicesOverviewPage = lazy(() =>
  import("./pages/public/ServicesOverviewPage").then((module) => ({ default: module.ServicesOverviewPage })),
);
const DoctorsOverviewPage = lazy(() =>
  import("./pages/public/DoctorsOverviewPage").then((module) => ({ default: module.DoctorsOverviewPage })),
);
const ContactPage = lazy(() => import("./pages/public/ContactPage").then((module) => ({ default: module.ContactPage })));
const LoginPage = lazy(() => import("./pages/auth/LoginPage").then((module) => ({ default: module.LoginPage })));
const ResetPasswordPage = lazy(() =>
  import("./pages/auth/ResetPasswordPage").then((module) => ({ default: module.ResetPasswordPage })),
);
const DashboardPage = lazy(() => import("./pages/admin/DashboardPage").then((module) => ({ default: module.DashboardPage })));
const AppointmentsPage = lazy(() => import("./pages/admin/AppointmentsPage").then((module) => ({ default: module.AppointmentsPage })));
const DoctorsPage = lazy(() => import("./pages/admin/DoctorsPage").then((module) => ({ default: module.DoctorsPage })));
const ServicesPage = lazy(() => import("./pages/admin/ServicesPage").then((module) => ({ default: module.ServicesPage })));
const PatientsPage = lazy(() => import("./pages/admin/PatientsPage").then((module) => ({ default: module.PatientsPage })));
const MessagesPage = lazy(() => import("./pages/admin/MessagesPage").then((module) => ({ default: module.MessagesPage })));
const ReviewsPage = lazy(() => import("./pages/admin/ReviewsPage").then((module) => ({ default: module.ReviewsPage })));
const AnalyticsPage = lazy(() => import("./pages/admin/AnalyticsPage").then((module) => ({ default: module.AnalyticsPage })));
const QRPage = lazy(() => import("./pages/admin/QRPage").then((module) => ({ default: module.QRPage })));
const SettingsPage = lazy(() => import("./pages/admin/SettingsPage").then((module) => ({ default: module.SettingsPage })));

function PublicSkeleton() {
  return (
    <div className="mx-auto max-w-5xl animate-pulse space-y-6 px-6 py-16">
      <div className="h-12 w-2/3 rounded-xl bg-slate-200" />
      <div className="h-5 w-1/2 rounded-lg bg-slate-200" />
      <div className="h-5 w-1/3 rounded-lg bg-slate-200" />
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-48 rounded-2xl bg-slate-200" />
        ))}
      </div>
    </div>
  );
}

function AdminSkeleton() {
  return (
    <div className="animate-pulse space-y-5">
      <div className="rounded-2xl border border-slate-200/80 bg-white px-5 py-4 shadow-sm">
        <div className="h-3 w-16 rounded bg-slate-200" />
        <div className="mt-2 h-6 w-64 rounded-lg bg-slate-200" />
        <div className="mt-1.5 h-4 w-80 rounded bg-slate-200" />
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-28 rounded-2xl border border-slate-200/70 bg-white" />
        ))}
      </div>
      <div className="h-64 rounded-2xl border border-slate-200/70 bg-white" />
    </div>
  );
}

function PublicLayout() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Suspense fallback={<PublicSkeleton />}>
        <Outlet />
      </Suspense>
    </div>
  );
}

function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="p-10">Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/auth/login" replace />;
  return (
    <AdminLayout>
      <Suspense fallback={<AdminSkeleton />}>
        <Outlet />
      </Suspense>
    </AdminLayout>
  );
}

export default function App() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesOverviewPage />} />
          <Route path="/doctors" element={<DoctorsOverviewPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/booking" element={<BookingPage />} />
        </Route>
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
        <Route path="/admin" element={<ProtectedRoute />}>
          <Route index element={<DashboardPage />} />
          <Route path="appointments" element={<AppointmentsPage />} />
          <Route path="doctors" element={<DoctorsPage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="patients" element={<PatientsPage />} />
          <Route path="messages" element={<MessagesPage />} />
          <Route path="reviews" element={<ReviewsPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="qr" element={<QRPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
