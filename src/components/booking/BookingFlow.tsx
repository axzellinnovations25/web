import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { useClinic } from "../../context/ClinicContext";
import type { BookingDraft } from "../../types";
import { buildBookingSlots, formatDate, formatTime } from "../../utils";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Input, Textarea } from "../ui/Input";

const initialDraft: BookingDraft = {
  patientName: "",
  phone: "",
  email: "",
  notes: "",
};

const steps = ["Service", "Doctor", "Date & Time", "Patient Info", "Confirm", "Success"];

export function BookingFlow() {
  const [searchParams] = useSearchParams();
  const { services, doctors, appointments, submitBooking, clinic } = useClinic();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<BookingDraft>({
    ...initialDraft,
    serviceId: searchParams.get("service") ?? undefined,
    doctorId: searchParams.get("doctor") ?? undefined,
  });
  const [resultReference, setResultReference] = useState<string | null>(null);

  const selectedDoctor = doctors.find((doctor) => doctor.id === draft.doctorId);
  const selectedService = services.find((service) => service.id === draft.serviceId);
  const availableSlots = useMemo(() => {
    if (!selectedDoctor || !draft.date) return [];
    return buildBookingSlots(selectedDoctor, draft.date, appointments);
  }, [appointments, draft.date, selectedDoctor]);

  const upcomingDates = [...Array(7)].map((_, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index);
    return date.toISOString().slice(0, 10);
  });

  function next() {
    setStep((current) => Math.min(current + 1, steps.length - 1));
  }

  function back() {
    setStep((current) => Math.max(current - 1, 0));
  }

  function completeBooking() {
    const appointment = submitBooking(draft);
    setResultReference(appointment.referenceNumber);
    setStep(5);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap gap-3">
        {steps.map((label, index) => (
          <div
            key={label}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              index <= step ? "bg-accent text-white" : "bg-white text-slate-500 ring-1 ring-slate-200"
            }`}
          >
            {index + 1}. {label}
          </div>
        ))}
      </div>

      <Card className="min-h-[520px]">
        {step === 0 && (
          <div>
            <h2 className="text-3xl font-extrabold">Select a service</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {services.filter((service) => service.isActive).map((service) => (
                <button
                  key={service.id}
                  onClick={() => {
                    setDraft((current) => ({ ...current, serviceId: service.id }));
                    next();
                  }}
                  className={`rounded-3xl border p-5 text-left ${
                    draft.serviceId === service.id ? "border-accent bg-accent/5" : "border-slate-200"
                  }`}
                >
                  <div className="text-xl font-bold">{service.name}</div>
                  <p className="mt-2 text-sm text-slate-600">{service.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 className="text-3xl font-extrabold">Select a doctor</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {doctors.filter((doctor) => doctor.isActive).map((doctor) => (
                <button
                  key={doctor.id}
                  onClick={() => {
                    setDraft((current) => ({ ...current, doctorId: doctor.id }));
                    next();
                  }}
                  className={`rounded-3xl border p-5 text-left ${
                    draft.doctorId === doctor.id ? "border-accent bg-accent/5" : "border-slate-200"
                  }`}
                >
                  <div className="text-xl font-bold">{doctor.name}</div>
                  <div className="mt-1 text-sm text-slate-500">{doctor.specialization}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-3xl font-extrabold">Select date and time</h2>
            <div className="mt-6 flex flex-wrap gap-3">
              {upcomingDates.map((date) => (
                <button
                  key={date}
                  onClick={() => setDraft((current) => ({ ...current, date }))}
                  className={`rounded-full px-4 py-3 text-sm font-semibold ${
                    draft.date === date ? "bg-accent text-white" : "bg-canvas text-slate-700"
                  }`}
                >
                  {formatDate(date)}
                </button>
              ))}
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {availableSlots.map((slot) => (
                <button
                  key={slot.time}
                  disabled={!slot.available}
                  onClick={() => {
                    setDraft((current) => ({ ...current, startTime: slot.time }));
                    next();
                  }}
                  className={`rounded-2xl px-4 py-4 text-sm font-semibold ${
                    slot.available
                      ? draft.startTime === slot.time
                        ? "bg-accent text-white"
                        : "bg-white ring-1 ring-slate-200"
                      : "cursor-not-allowed bg-slate-100 text-slate-400"
                  }`}
                >
                  {formatTime(slot.time)}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="max-w-2xl">
            <h2 className="text-3xl font-extrabold">Patient information</h2>
            <div className="mt-6 space-y-4">
              <Input
                placeholder="Full name"
                value={draft.patientName}
                onChange={(event) => setDraft((current) => ({ ...current, patientName: event.target.value }))}
              />
              <Input
                placeholder="Phone number"
                value={draft.phone}
                onChange={(event) => setDraft((current) => ({ ...current, phone: event.target.value }))}
              />
              <Input
                placeholder="Email"
                value={draft.email}
                onChange={(event) => setDraft((current) => ({ ...current, email: event.target.value }))}
              />
              <Textarea
                rows={5}
                placeholder="Additional notes"
                value={draft.notes}
                onChange={(event) => setDraft((current) => ({ ...current, notes: event.target.value }))}
              />
            </div>
            <div className="mt-6">
              <Button
                onClick={next}
                disabled={!draft.patientName || !draft.phone}
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="max-w-2xl">
            <h2 className="text-3xl font-extrabold">Confirm appointment</h2>
            <div className="mt-6 space-y-4 rounded-[2rem] bg-canvas p-6">
              <div><span className="font-semibold">Service:</span> {selectedService?.name}</div>
              <div><span className="font-semibold">Doctor:</span> {selectedDoctor?.name}</div>
              <div><span className="font-semibold">Date:</span> {draft.date ? formatDate(draft.date) : "-"}</div>
              <div><span className="font-semibold">Time:</span> {draft.startTime ? formatTime(draft.startTime) : "-"}</div>
              <div><span className="font-semibold">Patient:</span> {draft.patientName}</div>
              <div><span className="font-semibold">Contact:</span> {draft.phone}</div>
            </div>
            <div className="mt-6 flex gap-3">
              <Button variant="secondary" onClick={back}>Back</Button>
              <Button onClick={completeBooking} disabled={!clinic.bookingEnabled}>Confirm Booking</Button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="flex min-h-[440px] flex-col items-center justify-center text-center">
            <div className="flex size-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="size-10" />
            </div>
            <h2 className="mt-6 text-4xl font-extrabold">Booking received</h2>
            <p className="mt-4 max-w-xl text-slate-600">
              Reference number <span className="font-bold text-slate-900">{resultReference}</span>. If an email was provided, the patient confirmation has been flagged for sending.
            </p>
            <div className="mt-6 flex gap-3">
              <Button onClick={() => {
                setDraft(initialDraft);
                setStep(0);
                setResultReference(null);
              }}>
                Book another
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
