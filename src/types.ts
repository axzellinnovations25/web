export type AppointmentStatus = "pending" | "confirmed" | "cancelled" | "completed" | "no_show";

export interface OperatingDay {
  label: string;
  open: string;
  close: string;
  closed?: boolean;
}

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  tiktok?: string;
}

export interface ClinicSettings {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  logoUrl: string;
  heroImageUrl: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  latitude: number;
  longitude: number;
  emergencyBannerEnabled: boolean;
  emergencyMessage: string;
  showReviews: boolean;
  showPricing: boolean;
  bookingEnabled: boolean;
  operatingHours: Record<string, OperatingDay>;
  socialLinks: SocialLinks;
  bufferMinutes: number;
}

export interface Doctor {
  id: string;
  clinicId: string;
  name: string;
  title: string;
  specialization: string;
  qualifications: string;
  bio: string;
  photoUrl: string;
  availableSlots: Record<string, string[]>;
  consultationDuration: number;
  isActive: boolean;
  displayOrder: number;
  loginEmail?: string;
}

export interface Service {
  id: string;
  clinicId: string;
  name: string;
  description: string;
  durationMinutes: number;
  price: number;
  icon: string;
  isActive: boolean;
  displayOrder: number;
}

export interface Patient {
  id: string;
  clinicId: string;
  name: string;
  phone: string;
  email?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  totalVisits: number;
  lastVisit?: string;
  notes?: string;
}

export interface Appointment {
  id: string;
  clinicId: string;
  doctorId: string;
  serviceId: string;
  patientId: string;
  referenceNumber: string;
  date: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  notes?: string;
  confirmationSent: boolean;
  reminderSent: boolean;
  createdAt: string;
}

export interface Review {
  id: string;
  clinicId: string;
  patientName: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  isFeatured: boolean;
  createdAt: string;
}

export type ContactMessageStatus = "new" | "read" | "resolved";

export interface ContactMessage {
  id: string;
  clinicId: string;
  patientName: string;
  phone: string;
  email?: string;
  subject: string;
  message: string;
  status: ContactMessageStatus;
  createdAt: string;
}

export interface ContactMessageDraft {
  patientName: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
}

export interface Prescription {
  id: string;
  appointmentId: string;
  patientId: string;
  doctorId: string;
  fileUrl: string;
  fileName: string;
  fileType: string;
  notes?: string;
  createdAt: string;
}

export interface DoctorPrescriptionItem {
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

export interface DoctorPrescription {
  id: string;
  patientId: string;
  doctorId: string;
  clinicId: string;
  appointmentId?: string;
  diagnosis: string;
  items: DoctorPrescriptionItem[];
  notes?: string;
  createdAt: string;
}

export interface BookingDraft {
  serviceId?: string;
  doctorId?: string;
  date?: string;
  startTime?: string;
  patientName: string;
  phone: string;
  email: string;
  notes: string;
}

export interface ClinicState {
  clinic: ClinicSettings;
  doctors: Doctor[];
  services: Service[];
  patients: Patient[];
  appointments: Appointment[];
  reviews: Review[];
  contactMessages: ContactMessage[];
  prescriptions: Prescription[];
  doctorPrescriptions: DoctorPrescription[];
}
