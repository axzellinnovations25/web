import type { Appointment, AppointmentStatus, Doctor, Review, Service } from "./types";

export function classNames(...values: Array<string | undefined | false>) {
  return values.filter(Boolean).join(" ");
}

export function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(input: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(input));
}

export function formatTime(input: string) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(`2026-01-01T${input}`));
}

export function generateReferenceNumber(sequence: number) {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  return `MB-${date}-${String(sequence).padStart(3, "0")}`;
}

export function getStatusTone(status: AppointmentStatus) {
  const map: Record<AppointmentStatus, string> = {
    pending: "bg-amber-100 text-amber-700",
    confirmed: "bg-emerald-100 text-emerald-700",
    cancelled: "bg-rose-100 text-rose-700",
    completed: "bg-sky-100 text-sky-700",
    no_show: "bg-slate-200 text-slate-700",
  };
  return map[status];
}

export function averageRating(reviews: Review[]) {
  if (!reviews.length) return 0;
  return reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
}

export function nextAvailableSlot(doctor: Doctor, appointments: Appointment[]) {
  const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  for (let i = 0; i < 14; i += 1) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const dayLabel = weekDays[date.getDay()];
    const slots = doctor.availableSlots[dayLabel] ?? [];
    const isoDate = date.toISOString().slice(0, 10);
    const booked = appointments
      .filter((appointment) => appointment.doctorId === doctor.id && appointment.date === isoDate)
      .map((appointment) => appointment.startTime);
    const free = slots.find((slot) => !booked.includes(slot));
    if (free) return { date: isoDate, time: free };
  }
  return undefined;
}

export function buildBookingSlots(doctor: Doctor, date: string, appointments: Appointment[]) {
  const weekDay = new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(new Date(date));
  const booked = appointments
    .filter((appointment) => appointment.doctorId === doctor.id && appointment.date === date)
    .map((appointment) => appointment.startTime);
  return (doctor.availableSlots[weekDay] ?? []).map((time) => ({
    time,
    available: !booked.includes(time),
  }));
}

export function mostBookedDoctor(doctors: Doctor[], appointments: Appointment[]) {
  const counts = appointments.reduce<Record<string, number>>((acc, appointment) => {
    acc[appointment.doctorId] = (acc[appointment.doctorId] ?? 0) + 1;
    return acc;
  }, {});
  const winner = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  return doctors.find((doctor) => doctor.id === winner?.[0]);
}

export function mostPopularService(services: Service[], appointments: Appointment[]) {
  const counts = appointments.reduce<Record<string, number>>((acc, appointment) => {
    acc[appointment.serviceId] = (acc[appointment.serviceId] ?? 0) + 1;
    return acc;
  }, {});
  const winner = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  return services.find((service) => service.id === winner?.[0]);
}
