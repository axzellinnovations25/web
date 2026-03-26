import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { mockClinicState } from "../data/mock";
import type {
  Appointment,
  AppointmentStatus,
  BookingDraft,
  ClinicSettings,
  ClinicState,
  Doctor,
  Patient,
  Prescription,
  Review,
  Service,
} from "../types";
import { generateReferenceNumber } from "../utils";

interface ClinicContextValue extends ClinicState {
  updateClinic: (payload: Partial<ClinicSettings>) => void;
  saveDoctor: (doctor: Doctor) => void;
  saveService: (service: Service) => void;
  updateAppointmentStatus: (appointmentId: string, status: AppointmentStatus) => void;
  submitBooking: (payload: BookingDraft) => Appointment;
  submitReview: (payload: Pick<Review, "patientName" | "rating" | "comment">) => void;
  toggleReviewApproval: (reviewId: string) => void;
  toggleReviewFeatured: (reviewId: string) => void;
  savePatientNote: (patientId: string, notes: string) => void;
  addPrescription: (payload: Prescription) => void;
}

const ClinicContext = createContext<ClinicContextValue | undefined>(undefined);

export function ClinicProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ClinicState>(mockClinicState);

  const value = useMemo<ClinicContextValue>(
    () => ({
      ...state,
      updateClinic(payload) {
        setState((current) => ({ ...current, clinic: { ...current.clinic, ...payload } }));
      },
      saveDoctor(doctor) {
        setState((current) => {
          const exists = current.doctors.some((item) => item.id === doctor.id);
          return {
            ...current,
            doctors: exists
              ? current.doctors.map((item) => (item.id === doctor.id ? doctor : item))
              : [...current.doctors, doctor],
          };
        });
      },
      saveService(service) {
        setState((current) => {
          const exists = current.services.some((item) => item.id === service.id);
          return {
            ...current,
            services: exists
              ? current.services.map((item) => (item.id === service.id ? service : item))
              : [...current.services, service],
          };
        });
      },
      updateAppointmentStatus(appointmentId, status) {
        setState((current) => ({
          ...current,
          appointments: current.appointments.map((appointment) =>
            appointment.id === appointmentId ? { ...appointment, status } : appointment,
          ),
        }));
      },
      submitBooking(payload) {
        const sequence = state.appointments.length + 1;
        const service = state.services.find((item) => item.id === payload.serviceId);
        const doctor = state.doctors.find((item) => item.id === payload.doctorId);
        if (!service || !doctor || !payload.date || !payload.startTime) {
          throw new Error("Booking is incomplete.");
        }
        const patientId = `patient-${crypto.randomUUID()}`;
        const appointmentId = `appointment-${crypto.randomUUID()}`;
        const patient: Patient = {
          id: patientId,
          clinicId: state.clinic.id,
          name: payload.patientName,
          phone: payload.phone,
          email: payload.email || undefined,
          totalVisits: 1,
          lastVisit: payload.date,
        };
        const start = new Date(`2026-01-01T${payload.startTime}`);
        start.setMinutes(start.getMinutes() + doctor.consultationDuration);
        const endTime = start.toTimeString().slice(0, 5);
        const appointment: Appointment = {
          id: appointmentId,
          clinicId: state.clinic.id,
          doctorId: doctor.id,
          serviceId: service.id,
          patientId,
          referenceNumber: generateReferenceNumber(sequence),
          date: payload.date,
          startTime: payload.startTime,
          endTime,
          status: "pending",
          notes: payload.notes,
          confirmationSent: Boolean(payload.email),
          reminderSent: false,
          createdAt: new Date().toISOString(),
        };
        setState((current) => ({
          ...current,
          patients: [patient, ...current.patients],
          appointments: [appointment, ...current.appointments],
        }));
        return appointment;
      },
      submitReview(payload) {
        setState((current) => ({
          ...current,
          reviews: [
            {
              id: `review-${crypto.randomUUID()}`,
              clinicId: current.clinic.id,
              isApproved: false,
              isFeatured: false,
              createdAt: new Date().toISOString(),
              ...payload,
            },
            ...current.reviews,
          ],
        }));
      },
      toggleReviewApproval(reviewId) {
        setState((current) => ({
          ...current,
          reviews: current.reviews.map((review) =>
            review.id === reviewId ? { ...review, isApproved: !review.isApproved } : review,
          ),
        }));
      },
      toggleReviewFeatured(reviewId) {
        setState((current) => ({
          ...current,
          reviews: current.reviews.map((review) =>
            review.id === reviewId ? { ...review, isFeatured: !review.isFeatured } : review,
          ),
        }));
      },
      savePatientNote(patientId, notes) {
        setState((current) => ({
          ...current,
          patients: current.patients.map((patient) =>
            patient.id === patientId ? { ...patient, notes } : patient,
          ),
        }));
      },
      addPrescription(payload) {
        setState((current) => ({ ...current, prescriptions: [payload, ...current.prescriptions] }));
      },
    }),
    [state],
  );

  return <ClinicContext.Provider value={value}>{children}</ClinicContext.Provider>;
}

export function useClinic() {
  const context = useContext(ClinicContext);
  if (!context) throw new Error("useClinic must be used within ClinicProvider");
  return context;
}
