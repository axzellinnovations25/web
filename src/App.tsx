import { lazy, Suspense } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { AdminLayout } from "./components/layout/AdminLayout";
import { Navbar } from "./components/layout/Navbar";
import { useAuth } from "./context/AuthContext";

const LandingPage = lazy(() => import("./pages/public/LandingPage").then((module) => ({ default: module.LandingPage })));
const BookingPage = lazy(() => import("./pages/public/BookingPage").then((module) => ({ default: module.BookingPage })));
const LoginPage = lazy(() => import("./pages/auth/LoginPage").then((module) => ({ default: module.LoginPage })));
const ResetPasswordPage = lazy(() =>
  import("./pages/auth/ResetPasswordPage").then((module) => ({ default: module.ResetPasswordPage })),
);
const DashboardPage = lazy(() => import("./pages/admin/AdminPages").then((module) => ({ default: module.DashboardPage })));
const AppointmentsPage = lazy(() =>
  import("./pages/admin/AdminPages").then((module) => ({ default: module.AppointmentsPage })),
);
const DoctorsPage = lazy(() => import("./pages/admin/AdminPages").then((module) => ({ default: module.DoctorsPage })));
const ServicesPage = lazy(() => import("./pages/admin/AdminPages").then((module) => ({ default: module.ServicesPage })));
const PatientsPage = lazy(() => import("./pages/admin/AdminPages").then((module) => ({ default: module.PatientsPage })));
const ReviewsPage = lazy(() => import("./pages/admin/AdminPages").then((module) => ({ default: module.ReviewsPage })));
const AnalyticsPage = lazy(() =>
  import("./pages/admin/AdminPages").then((module) => ({ default: module.AnalyticsPage })),
);
const QRPage = lazy(() => import("./pages/admin/AdminPages").then((module) => ({ default: module.QRPage })));
const SettingsPage = lazy(() => import("./pages/admin/AdminPages").then((module) => ({ default: module.SettingsPage })));

function PublicLayout() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Outlet />
    </div>
  );
}

function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="p-10">Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/auth/login" replace />;
  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
}

export default function App() {
  return (
    <Suspense fallback={<div className="p-10 text-sm font-semibold text-slate-500">Loading route...</div>}>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
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
          <Route path="reviews" element={<ReviewsPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="qr" element={<QRPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
