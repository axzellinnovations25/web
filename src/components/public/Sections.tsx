import { ArrowRight, Clock3, MapPin, MessageCircleMore, Phone, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useClinic } from "../../context/ClinicContext";
import { averageRating, formatMoney, nextAvailableSlot } from "../../utils";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";

export function HeroSection() {
  const { clinic } = useClinic();
  return (
    <section className="relative overflow-hidden px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] bg-white px-8 py-10 shadow-soft sm:px-10 sm:py-14">
          <div className="inline-flex rounded-full bg-accent/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.3em] text-accent">
            Clinic Website Builder
          </div>
          <h1 className="mt-6 max-w-xl text-5xl font-extrabold leading-tight text-slate-950 sm:text-6xl">
            Premium clinic websites with booking built in.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">{clinic.description}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/booking">
              <Button>
                Book Appointment
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </Link>
            <Link to="/admin">
              <Button variant="secondary">Open Admin Preview</Button>
            </Link>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <Card className="bg-canvas">
              <div className="text-sm text-muted">Operating Hours</div>
              <div className="mt-2 font-bold">{clinic.operatingHours.Monday.open} - {clinic.operatingHours.Friday.close}</div>
            </Card>
            <Card className="bg-canvas">
              <div className="text-sm text-muted">WhatsApp</div>
              <div className="mt-2 font-bold">{clinic.whatsapp}</div>
            </Card>
            <Card className="bg-canvas">
              <div className="text-sm text-muted">Location</div>
              <div className="mt-2 font-bold">San Francisco</div>
            </Card>
          </div>
        </div>
        <div className="relative min-h-[460px] overflow-hidden rounded-[2rem] bg-slate-900 shadow-soft">
          <img src={clinic.heroImageUrl} alt={clinic.name} className="h-full w-full object-cover opacity-85" />
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900/50 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 rounded-[1.75rem] bg-white/90 p-5 backdrop-blur">
            <div className="text-sm text-muted">Same codebase. New clinic. No rebuild workflow.</div>
            <div className="mt-2 text-xl font-bold text-slate-950">{clinic.tagline}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ServicesSection() {
  const { services, clinic } = useClinic();
  const active = services.filter((service) => service.isActive).sort((a, b) => a.displayOrder - b.displayOrder);
  return (
    <section id="services" className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <div className="text-sm font-bold uppercase tracking-[0.25em] text-accent">Services</div>
          <h2 className="mt-3 text-3xl font-extrabold">Care options patients can book in one minute.</h2>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {active.map((service) => (
            <Card key={service.id} className="flex h-full flex-col justify-between">
              <div>
                <div className="inline-flex rounded-full bg-accent/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.25em] text-accent">
                  {service.durationMinutes} min
                </div>
                <h3 className="mt-4 text-2xl font-bold">{service.name}</h3>
                <p className="mt-3 text-slate-600">{service.description}</p>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <div className="text-lg font-bold">{clinic.showPricing ? formatMoney(service.price) : "Pricing hidden"}</div>
                <Link to={`/booking?service=${service.id}`}>
                  <Button variant="secondary">Book</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export function DoctorsSection() {
  const { doctors, appointments } = useClinic();
  const active = doctors.filter((doctor) => doctor.isActive).sort((a, b) => a.displayOrder - b.displayOrder);
  return (
    <section id="doctors" className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <div className="text-sm font-bold uppercase tracking-[0.25em] text-accent2">Doctors</div>
          <h2 className="mt-3 text-3xl font-extrabold">Specialists surfaced directly from admin-managed profiles.</h2>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {active.map((doctor) => {
            const slot = nextAvailableSlot(doctor, appointments);
            return (
              <Card key={doctor.id} className="overflow-hidden p-0">
                <img src={doctor.photoUrl} alt={doctor.name} className="h-64 w-full object-cover" />
                <div className="p-6">
                  <div className="text-xs font-bold uppercase tracking-[0.25em] text-muted">{doctor.specialization}</div>
                  <h3 className="mt-2 text-2xl font-bold">
                    {doctor.title} {doctor.name}
                  </h3>
                  <p className="mt-3 text-slate-600">{doctor.bio}</p>
                  <div className="mt-4 rounded-3xl bg-canvas p-4 text-sm text-slate-700">
                    Next slot: {slot ? `${slot.date} at ${slot.time}` : "No open slot"}
                  </div>
                  <Link to={`/booking?doctor=${doctor.id}`} className="mt-5 inline-block">
                    <Button>Book with this Doctor</Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function ReviewsSection() {
  const { reviews, clinic } = useClinic();
  if (!clinic.showReviews) return null;
  const approved = reviews.filter((review) => review.isApproved);
  const featured = approved.filter((review) => review.isFeatured);
  return (
    <section id="reviews" className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-[2rem] bg-[#101827] px-8 py-10 text-white shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-sm font-bold uppercase tracking-[0.25em] text-accent2">Reviews</div>
            <h2 className="mt-3 text-3xl font-extrabold">Patients see approved feedback, not raw submissions.</h2>
          </div>
          <div className="rounded-full bg-white/10 px-5 py-3 text-sm font-semibold">
            <Star className="mr-2 inline size-4 fill-current text-amber-300" />
            {averageRating(approved).toFixed(1)} average across {approved.length} reviews
          </div>
        </div>
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {(featured.length ? featured : approved).slice(0, 3).map((review) => (
            <Card key={review.id} className="bg-white/95 text-slate-900">
              <div className="text-amber-500">{"★".repeat(review.rating)}</div>
              <p className="mt-4 text-slate-700">{review.comment}</p>
              <div className="mt-4 font-bold">{review.patientName}</div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ContactSection() {
  const { clinic } = useClinic();
  return (
    <section id="contact" className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <div className="text-sm font-bold uppercase tracking-[0.25em] text-accent">Contact</div>
          <h2 className="mt-3 text-3xl font-extrabold">Everything patients need before they arrive.</h2>
          <div className="mt-6 space-y-4 text-slate-700">
            <div><Phone className="mr-3 inline size-4" />{clinic.phone}</div>
            <div><MessageCircleMore className="mr-3 inline size-4" />{clinic.whatsapp}</div>
            <div><MapPin className="mr-3 inline size-4" />{clinic.address}</div>
            <div><Clock3 className="mr-3 inline size-4" />Mon-Fri {clinic.operatingHours.Monday.open} - {clinic.operatingHours.Friday.close}</div>
          </div>
          <a
            href={`https://wa.me/${clinic.whatsapp.replace(/\D/g, "")}`}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-block"
          >
            <Button>Open WhatsApp</Button>
          </a>
        </Card>
        <div className="overflow-hidden rounded-[2rem] shadow-soft ring-1 ring-slate-200">
          <iframe
            title="Clinic Map"
            src={`https://maps.google.com/maps?q=${clinic.latitude},${clinic.longitude}&z=15&output=embed`}
            className="h-[420px] w-full border-0"
          />
        </div>
      </div>
    </section>
  );
}
