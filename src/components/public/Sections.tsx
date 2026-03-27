import { useState, useRef, useEffect } from "react";
import type { ElementType, ReactNode } from "react";
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock3,
  Heart,
  Mail,
  MapPin,
  MessageCircleMore,
  Phone,
  ScanSearch,
  Send,
  Shield,
  Star,
  Stethoscope,
  Activity,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useClinic } from "../../context/ClinicContext";
import { averageRating, formatMoney, nextAvailableSlot } from "../../utils";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Input, Textarea } from "../ui/Input";

// ─── Icon map ─────────────────────────────────────────────────────────────────

const serviceIconMap: Record<string, ElementType> = {
  HeartPulse: Heart,
  Heart,
  ScanSearch,
  ShieldCheck: Shield,
  Shield,
  Stethoscope,
  Activity,
};

function ServiceIcon({ name, className }: { name: string; className?: string }) {
  const Icon = serviceIconMap[name] ?? Stethoscope;
  return <Icon className={className} />;
}

// ─── Scroll Reveal ────────────────────────────────────────────────────────────

export function RevealOnScroll({
  children,
  className = "",
  delay = 0,
  direction = "up",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right" | "none";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const initial =
    direction === "up" ? "translateY(28px)" :
    direction === "left" ? "translateX(-32px)" :
    direction === "right" ? "translateX(32px)" :
    "none";

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : initial,
        transition: `opacity 0.65s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.65s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

export function HeroSection() {
  const { clinic, reviews, doctors, appointments } = useClinic();
  const approved = reviews.filter((r) => r.isApproved);
  const avg = averageRating(approved);
  const activeDoctors = doctors.filter((d) => d.isActive).length;

  return (
    <section className="relative overflow-hidden px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      {/* Ambient background blobs */}
      <div className="pointer-events-none absolute -right-72 -top-72 size-[750px] rounded-full bg-accent/[0.07] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 size-[600px] rounded-full bg-accent2/[0.07] blur-3xl" />
      {/* Dot grid */}
      <div className="bg-dot-grid pointer-events-none absolute inset-0 opacity-[0.45]" />

      <div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[1fr_0.9fr] lg:gap-12">
        {/* ── Left: content ── */}
        <div className="flex flex-col justify-center py-4">
          {/* Live badge */}
          <div className="animate-fadeInUp inline-flex w-fit items-center gap-2 rounded-full border border-accent/25 bg-white px-4 py-2 shadow-sm ring-1 ring-accent/10">
            <span className="size-2 animate-pulse rounded-full bg-accent" />
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-accent">
              Now Accepting Patients
            </span>
          </div>

          <h1 className="animate-fadeInUp delay-100 mt-6 text-3xl font-extrabold leading-[1.08] tracking-tight text-slate-950 sm:text-[2.75rem] xl:text-[3.5rem]">
            {clinic.name}
          </h1>
          <p className="animate-fadeInUp delay-200 mt-3 text-xl font-semibold text-accent">
            {clinic.tagline}
          </p>
          <p className="animate-fadeInUp delay-300 mt-4 max-w-lg text-base leading-7 text-slate-500">
            {clinic.description}
          </p>

          {/* CTAs */}
          <div className="animate-fadeInUp delay-400 mt-8 flex flex-wrap gap-3">
            <Link to="/booking">
              <Button className="group relative gap-2 overflow-hidden px-7 py-4 text-[15px] shadow-accent-glow transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
                Book Appointment
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Button>
            </Link>
            <a href={`tel:${clinic.phone}`}>
              <Button
                variant="secondary"
                className="gap-2 px-7 py-4 text-[15px] transition-all duration-200 hover:-translate-y-0.5"
              >
                <Phone className="size-4" />
                Call Us
              </Button>
            </a>
          </div>

          {/* Stats */}
          <div className="animate-fadeInUp delay-500 mt-10 grid grid-cols-3 gap-3">
            {[
              { value: `${activeDoctors}+`, label: "Specialists" },
              {
                value: `${appointments.length > 3 ? appointments.length : "500"}+`,
                label: "Patients",
              },
              { value: avg > 0 ? avg.toFixed(1) : "4.9", label: "Rating" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-100 bg-white px-4 py-5 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/20 hover:shadow-md"
              >
                <div className="text-2xl font-extrabold text-ink">{stat.value}</div>
                <div className="mt-0.5 text-[11px] font-medium text-muted">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Trust strip */}
          <div className="animate-fadeInUp delay-600 mt-8 flex flex-wrap gap-5 border-t border-slate-100 pt-7">
            {[
              { icon: Shield, label: "Certified Specialists" },
              { icon: Clock3, label: "Same-Day Slots" },
              { icon: Heart, label: "Compassionate Care" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-sm text-slate-500">
                <Icon className="size-4 text-accent" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: image ── */}
        <div className="animate-slideInRight relative mt-2 lg:mt-0">
          {/* Decorative dashed ring */}
          <div className="absolute -inset-3 rounded-[2.6rem] border-2 border-dashed border-accent/15" />

          <div className="relative overflow-hidden rounded-[2rem] shadow-2xl shadow-slate-900/15">
            <img
              src={
                clinic.heroImageUrl ||
                "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1400&q=80"
              }
              alt={clinic.name}
              className="aspect-[4/5] w-full object-cover transition-transform duration-700 hover:scale-[1.03]"
              loading="eager"
            />
            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/72 via-slate-900/20 to-transparent" />

            {/* Rating pill — top right */}
            {approved.length > 0 && (
              <div className="animate-scaleIn absolute right-4 top-4 rounded-2xl bg-white/95 px-4 py-3 shadow-lg backdrop-blur-sm ring-1 ring-white/60">
                <div className="flex items-center gap-1.5">
                  <Star className="size-4 fill-amber-400 text-amber-400" />
                  <span className="text-base font-extrabold text-slate-900">{avg.toFixed(1)}</span>
                  <span className="text-xs text-slate-500">/ 5.0</span>
                </div>
                <div className="mt-0.5 text-[10px] font-medium text-slate-400">
                  {approved.length} verified review{approved.length !== 1 ? "s" : ""}
                </div>
              </div>
            )}

            {/* Specialization badge — top left */}
            <div className="animate-scaleIn delay-200 absolute left-4 top-4 rounded-xl bg-accent px-3 py-2 text-white shadow-md">
              <div className="flex items-center gap-1.5 text-xs font-bold">
                <Stethoscope className="size-3.5" />
                Premium Healthcare
              </div>
            </div>

            {/* Floating booking CTA — bottom */}
            <div className="absolute bottom-5 left-5 right-5">
              <div className="glass rounded-[1.5rem] p-5 shadow-xl ring-1 ring-white/50">
                <div className="flex items-center gap-3">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent text-white shadow-sm">
                    <CheckCircle2 className="size-5" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-muted">No login required</div>
                    <div className="font-bold text-slate-900">Book in under 60 seconds</div>
                  </div>
                  <Link to="/booking" className="ml-auto">
                    <div className="flex size-10 items-center justify-center rounded-full bg-accent text-white shadow-sm transition-all duration-200 hover:scale-110 hover:shadow-md">
                      <ArrowRight className="size-4" />
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Services ─────────────────────────────────────────────────────────────────

export function ServicesSection() {
  const { services, clinic } = useClinic();
  const active = services
    .filter((s) => s.isActive)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <section id="services" className="bg-slate-50/60 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <RevealOnScroll className="mb-12 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.3em] text-accent">
              Our Services
            </div>
            <h2 className="mt-2 max-w-md text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
              Expert care tailored to your needs
            </h2>
          </div>
          <Link to="/booking">
            <Button
              variant="secondary"
              className="shrink-0 gap-2 transition-all duration-200 hover:-translate-y-0.5"
            >
              Book a session <ArrowRight className="size-4" />
            </Button>
          </Link>
        </RevealOnScroll>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {active.map((service, index) => (
            <RevealOnScroll key={service.id} delay={index * 75}>
              <Link
                to={`/booking?service=${service.id}`}
                className="group flex h-full flex-col rounded-[2rem] border border-slate-100 bg-white p-7 shadow-soft transition-all duration-300 hover:-translate-y-2 hover:border-accent/20 hover:shadow-xl"
              >
                {/* Icon */}
                <div
                  className={`inline-flex size-14 items-center justify-center rounded-2xl text-white transition-all duration-300 group-hover:scale-110 ${
                    index % 2 === 0
                      ? "bg-gradient-to-br from-accent to-teal-600 shadow-md shadow-accent/20 group-hover:shadow-lg group-hover:shadow-accent/35"
                      : "bg-gradient-to-br from-accent2 to-orange-400 shadow-md shadow-accent2/20 group-hover:shadow-lg group-hover:shadow-accent2/35"
                  }`}
                >
                  <ServiceIcon name={service.icon} className="size-7" />
                </div>

                {/* Duration pill */}
                <div className="mt-5 inline-flex w-fit rounded-full bg-canvas px-3 py-1 text-[11px] font-semibold text-muted">
                  {service.durationMinutes} min session
                </div>

                <h3 className="mt-3 text-xl font-bold text-ink transition-colors duration-200 group-hover:text-accent">
                  {service.name}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-slate-500">
                  {service.description}
                </p>

                <div className="mt-6 flex items-center justify-between">
                  {clinic.showPricing ? (
                    <div className="text-lg font-extrabold text-ink">
                      {formatMoney(service.price)}
                    </div>
                  ) : (
                    <div className="text-sm text-slate-400">Contact for pricing</div>
                  )}
                  <div className="flex size-9 items-center justify-center rounded-full bg-accent/10 text-accent transition-all duration-300 group-hover:bg-accent group-hover:text-white group-hover:shadow-md">
                    <ArrowRight className="size-4" />
                  </div>
                </div>
              </Link>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Doctors ──────────────────────────────────────────────────────────────────

export function DoctorsSection() {
  const { doctors, appointments } = useClinic();
  const active = doctors
    .filter((d) => d.isActive)
    .sort((a, b) => a.displayOrder - b.displayOrder);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <section id="doctors" className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <RevealOnScroll className="mb-12">
          <div className="text-[11px] font-bold uppercase tracking-[0.3em] text-accent2">
            Our Team
          </div>
          <h2 className="mt-2 max-w-md text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
            Meet our experienced specialists
          </h2>
        </RevealOnScroll>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {active.map((doctor, index) => {
            const slot = nextAvailableSlot(doctor, appointments);
            const isExpanded = expandedId === doctor.id;

            return (
              <RevealOnScroll key={doctor.id} delay={index * 100}>
                <div className="group overflow-hidden rounded-[2rem] bg-white shadow-soft ring-1 ring-slate-100 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:ring-accent/15">
                  {/* Photo */}
                  <div className="relative h-52 overflow-hidden bg-slate-100 sm:h-64">
                    {doctor.photoUrl ? (
                      <img
                        src={doctor.photoUrl}
                        alt={`${doctor.title} ${doctor.name}`}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gradient-to-br from-accent/10 to-accent2/10">
                        <Stethoscope className="size-16 text-accent/30" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/55 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <span className="rounded-full bg-accent px-3 py-1.5 text-xs font-bold text-white shadow-sm">
                        {doctor.specialization}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-extrabold text-ink">
                      {doctor.title} {doctor.name}
                    </h3>
                    <div className="mt-1 text-sm text-muted">{doctor.qualifications}</div>

                    <button
                      onClick={() => setExpandedId(isExpanded ? null : doctor.id)}
                      className="mt-3 flex items-center gap-1 text-xs font-semibold text-accent transition-opacity hover:opacity-70"
                    >
                      {isExpanded ? "Hide bio" : "Read bio"}
                      {isExpanded ? (
                        <ChevronUp className="size-3.5" />
                      ) : (
                        <ChevronDown className="size-3.5" />
                      )}
                    </button>

                    {isExpanded && (
                      <p className="mt-3 text-sm leading-6 text-slate-600">{doctor.bio}</p>
                    )}

                    <div className="mt-4 flex items-center gap-2.5 rounded-2xl bg-canvas px-4 py-3 text-sm">
                      <Calendar className="size-4 shrink-0 text-accent" />
                      {slot ? (
                        <span className="text-slate-600">
                          Next:{" "}
                          <span className="font-semibold text-ink">
                            {slot.date} at {slot.time}
                          </span>
                        </span>
                      ) : (
                        <span className="text-slate-400">No open slots in 2 weeks</span>
                      )}
                    </div>

                    <Link to={`/booking?doctor=${doctor.id}`} className="mt-5 block">
                      <Button className="w-full transition-all duration-200 hover:-translate-y-0.5">
                        Book with {doctor.title} {doctor.name}
                      </Button>
                    </Link>
                  </div>
                </div>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Reviews ──────────────────────────────────────────────────────────────────

function StarRow({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
  const cls = size === "md" ? "size-5" : "size-4";
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${cls} ${
            star <= rating ? "fill-amber-400 text-amber-400" : "text-white/20"
          }`}
        />
      ))}
    </div>
  );
}

function ReviewForm({ onClose }: { onClose: () => void }) {
  const { submitReview } = useClinic();
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit() {
    if (!name.trim() || !comment.trim()) return;
    submitReview({ patientName: name, rating, comment });
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center py-10 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle2 className="size-8 text-emerald-600" />
        </div>
        <h3 className="mt-5 text-xl font-bold text-ink">Thank you!</h3>
        <p className="mt-2 text-sm text-slate-500">
          Your review is pending approval and will appear shortly.
        </p>
        <Button className="mt-6" onClick={onClose}>
          Close
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-ink">Write a Review</h3>
        <button
          onClick={onClose}
          className="flex size-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-canvas hover:text-ink"
        >
          <X className="size-5" />
        </button>
      </div>
      <Input
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <div>
        <div className="mb-2 text-sm font-semibold text-ink">Rating</div>
        <div className="flex gap-1.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              className="transition-transform hover:scale-110"
              aria-label={`${star} stars`}
            >
              <Star
                className={`size-7 ${
                  star <= rating ? "fill-amber-400 text-amber-400" : "text-slate-200"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
      <Textarea
        placeholder="Share your experience with us..."
        rows={4}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <Button
        className="w-full gap-2"
        disabled={!name.trim() || !comment.trim()}
        onClick={handleSubmit}
      >
        <Send className="size-4" />
        Submit Review
      </Button>
    </div>
  );
}

export function ReviewsSection() {
  const { reviews, clinic } = useClinic();
  const [showForm, setShowForm] = useState(false);
  if (!clinic.showReviews) return null;

  const approved = reviews.filter((r) => r.isApproved);
  const featured = approved.filter((r) => r.isFeatured);
  const displayed = (featured.length ? featured : approved).slice(0, 3);
  const avg = averageRating(approved);

  return (
    <section id="reviews" className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <RevealOnScroll>
          <div className="overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#0f172a] via-[#0e1e32] to-[#0a1628] shadow-2xl">
            {/* Accent bar */}
            <div className="h-1 w-full bg-gradient-to-r from-accent via-accent2 to-accent" />

            <div className="px-8 py-12 sm:px-12 sm:py-14">
              {/* Header */}
              <div className="flex flex-wrap items-start justify-between gap-6">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-[0.3em] text-accent2">
                    Patient Reviews
                  </div>
                  <h2 className="mt-2 max-w-md text-3xl font-extrabold leading-tight text-white sm:text-4xl">
                    Real feedback from our patients
                  </h2>
                  {avg > 0 && (
                    <div className="mt-4 flex items-center gap-3">
                      <StarRow rating={Math.round(avg)} size="md" />
                      <span className="font-bold text-white">{avg.toFixed(1)}</span>
                      <span className="text-sm text-white/50">
                        from {approved.length} review{approved.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  )}
                </div>
                <Button
                  onClick={() => setShowForm((v) => !v)}
                  variant="secondary"
                  className="shrink-0 transition-all duration-200 hover:-translate-y-0.5"
                >
                  {showForm ? "Cancel" : "Write a Review"}
                </Button>
              </div>

              {/* Review form */}
              {showForm && (
                <div className="mt-8 rounded-[1.5rem] bg-white p-6 sm:p-8">
                  <ReviewForm onClose={() => setShowForm(false)} />
                </div>
              )}

              {/* Review cards */}
              {!showForm && displayed.length > 0 && (
                <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {displayed.map((review, index) => (
                    <div
                      key={review.id}
                      className="flex flex-col rounded-[1.5rem] border border-white/8 bg-white/95 p-6 text-slate-900 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                      style={{ transitionDelay: `${index * 60}ms` }}
                    >
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`size-4 ${
                              star <= review.rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-slate-200"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="mt-4 flex-1 text-sm leading-7 text-slate-600">
                        &ldquo;{review.comment}&rdquo;
                      </p>
                      <div className="mt-5 flex items-center gap-3">
                        <div className="flex size-9 items-center justify-center rounded-full bg-accent/10 text-sm font-bold text-accent">
                          {review.patientName.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-semibold text-ink">
                          {review.patientName}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!showForm && approved.length === 0 && (
                <p className="mt-8 text-sm text-white/40">
                  No reviews yet. Be the first to leave one.
                </p>
              )}
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}

// ─── Contact ──────────────────────────────────────────────────────────────────

export function ContactSection() {
  const { clinic } = useClinic();
  const days = Object.entries(clinic.operatingHours);

  return (
    <section id="contact" className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <RevealOnScroll className="mb-12">
          <div className="text-[11px] font-bold uppercase tracking-[0.3em] text-accent">
            Get in Touch
          </div>
          <h2 className="mt-2 max-w-md text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
            We&rsquo;re here when you need us
          </h2>
        </RevealOnScroll>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          {/* Left — contact + hours */}
          <RevealOnScroll className="space-y-5" direction="left">
            <Card>
              <div className="space-y-2">
                <a
                  href={`tel:${clinic.phone}`}
                  className="flex items-center gap-4 rounded-2xl p-3 transition hover:bg-canvas"
                >
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                    <Phone className="size-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wide text-muted">
                      Phone
                    </div>
                    <div className="font-bold text-ink">{clinic.phone}</div>
                  </div>
                </a>
                <a
                  href={`https://wa.me/${clinic.whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-4 rounded-2xl p-3 transition hover:bg-canvas"
                >
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#25D366]/10 text-[#25D366]">
                    <MessageCircleMore className="size-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wide text-muted">
                      WhatsApp
                    </div>
                    <div className="font-bold text-ink">{clinic.whatsapp}</div>
                  </div>
                </a>
                <a
                  href={`mailto:${clinic.email}`}
                  className="flex items-center gap-4 rounded-2xl p-3 transition hover:bg-canvas"
                >
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                    <Mail className="size-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wide text-muted">
                      Email
                    </div>
                    <div className="font-bold text-ink">{clinic.email}</div>
                  </div>
                </a>
                <div className="flex items-start gap-4 rounded-2xl p-3">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                    <MapPin className="size-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wide text-muted">
                      Address
                    </div>
                    <div className="font-bold text-ink">{clinic.address}</div>
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <div className="mb-4 flex items-center gap-2">
                <Clock3 className="size-4 text-accent" />
                <span className="font-bold text-ink">Operating Hours</span>
              </div>
              <div className="space-y-2.5">
                {days.map(([day, info]) => (
                  <div
                    key={day}
                    className="flex items-center justify-between rounded-xl px-3 py-1.5 text-sm odd:bg-accent/[0.05]"
                  >
                    <span className="font-medium text-slate-700">{info.label}</span>
                    {info.closed ? (
                      <span className="rounded-full bg-slate-100 px-3 py-0.5 text-xs font-semibold text-slate-400">
                        Closed
                      </span>
                    ) : (
                      <span className="text-slate-600">
                        {info.open} – {info.close}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </RevealOnScroll>

          {/* Right — map */}
          <RevealOnScroll direction="right">
            <div className="overflow-hidden rounded-[2rem] shadow-soft ring-1 ring-slate-200 transition-shadow duration-300 hover:shadow-lg">
              <iframe
                title="Clinic Location Map"
                src={`https://maps.google.com/maps?q=${clinic.latitude},${clinic.longitude}&z=15&output=embed`}
                className="h-full min-h-[300px] w-full border-0 sm:min-h-[480px]"
                loading="lazy"
              />
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
