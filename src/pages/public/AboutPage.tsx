import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CheckCircle2,
  Clock3,
  HeartPulse,
  Shield,
  Star,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { ReviewsSection, RevealOnScroll } from "../../components/public/Sections";
import { useClinic } from "../../context/ClinicContext";
import { Button } from "../../components/ui/Button";
import { ClinicFooter, EmergencyBanner, WhatsAppFAB } from "./shared";

function PremiumHero() {
  const { clinic, doctors, services } = useClinic();
  const activeDoctors = doctors.filter((d) => d.isActive).length;
  const activeServices = services.filter((s) => s.isActive).length;

  const stats = [
    { label: "Specialists", value: `${activeDoctors}+`, icon: Users },
    { label: "Clinical Services", value: `${activeServices}+`, icon: HeartPulse },
    { label: "Patient Support", value: "6 Days", icon: Clock3 },
  ];

  return (
    <section className="relative overflow-hidden px-4 pb-8 pt-8 sm:px-6 lg:px-8">
      {/* Decorative background blobs */}
      <div className="pointer-events-none absolute -left-40 -top-40 size-[600px] rounded-full bg-accent/5 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 top-0 size-[500px] rounded-full bg-[rgba(251,146,60,0.05)] blur-3xl" />

      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        {/* Left — text */}
        <div className="relative rounded-[2.25rem] border border-slate-200 bg-white px-8 py-10 shadow-soft sm:px-12 sm:py-12">
          <div className="animate-fadeInUp text-[11px] font-bold uppercase tracking-[0.32em] text-accent">
            About The Clinic
          </div>
          <h1 className="animate-fadeInUp delay-100 mt-4 max-w-2xl text-4xl font-extrabold leading-[1.08] tracking-tight text-slate-950 sm:text-[3.25rem]">
            Premium clinical care with the{" "}
            <span className="gradient-text">confidence</span> of a modern hospital
          </h1>
          <p className="animate-fadeInUp delay-200 mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
            {clinic.description}
          </p>

          <div className="animate-fadeInUp delay-300 mt-8 flex flex-wrap gap-3">
            <Link to="/booking">
              <Button className="shadow-accent-glow gap-2 px-6 py-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(15,118,110,0.40)]">
                Book Appointment
                <ArrowRight className="size-4" />
              </Button>
            </Link>
            <Link to="/services">
              <Button variant="secondary" className="px-6 py-3.5 transition-all duration-200 hover:-translate-y-0.5">
                Explore Services
              </Button>
            </Link>
          </div>

          <div className="animate-fadeInUp delay-400 mt-10 grid gap-3 sm:grid-cols-3">
            {stats.map((item) => (
              <div
                key={item.label}
                className="group rounded-[1.5rem] border border-slate-200 bg-slate-50 px-5 py-5 transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 hover:bg-white hover:shadow-md"
              >
                <item.icon className="size-5 text-accent transition-transform duration-300 group-hover:scale-110" />
                <div className="mt-2 text-2xl font-extrabold text-slate-950">{item.value}</div>
                <div className="mt-0.5 text-sm text-slate-500">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — image */}
        <div className="animate-slideInRight overflow-hidden rounded-[2.25rem] border border-slate-200 bg-white shadow-soft">
          <div className="relative h-full min-h-[440px] bg-slate-900">
            <img
              src="https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80"
              alt={`${clinic.name} — clinic interior`}
              className="h-full w-full object-cover transition-transform duration-[8s] hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

            {/* Floating verified badge */}
            <div className="absolute right-5 top-5 animate-floatY">
              <div className="flex items-center gap-2 rounded-2xl bg-white/95 px-4 py-2.5 shadow-lg backdrop-blur-sm">
                <BadgeCheck className="size-5 text-accent" />
                <span className="text-xs font-bold text-slate-700">Verified Clinic</span>
              </div>
            </div>

            {/* Bottom overlay card */}
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
              <div className="rounded-[1.75rem] border border-white/20 bg-white/92 p-6 backdrop-blur-sm">
                <div className="flex items-start gap-4">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                    <Building2 className="size-6" />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Clinic Profile</div>
                    <div className="mt-1 text-lg font-extrabold text-slate-950">{clinic.name}</div>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{clinic.address}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CareStandards() {
  const { doctors, clinic } = useClinic();

  const pillars = [
    {
      title: "Clinical credibility",
      description:
        "A specialist-led environment with a public presentation that reflects confidence, trust, and professionalism.",
      icon: BadgeCheck,
    },
    {
      title: "Patient-centered access",
      description:
        "Straightforward booking, clear service information, and responsive communication across every step.",
      icon: HeartPulse,
    },
    {
      title: "Operational discipline",
      description:
        "Consistent scheduling, structured care delivery, and a calm digital experience aligned with premium healthcare.",
      icon: Shield,
    },
  ];

  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <RevealOnScroll className="mb-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.3em] text-accent">Our Standard</div>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight text-slate-950 sm:text-[2.25rem]">
              Built for trust.{" "}
              <span className="gradient-text">Designed for patients.</span>
            </h2>
          </div>
          <p className="text-base leading-8 text-slate-600">
            The clinic environment should reassure patients that they&rsquo;re dealing with an organized medical
            team, a capable specialist roster, and a service standard that values quality at every step.
          </p>
        </RevealOnScroll>

        {/* Pillar cards */}
        <div className="grid gap-5 lg:grid-cols-3">
          {pillars.map((pillar, index) => (
            <RevealOnScroll key={pillar.title} delay={index * 120}>
              <div className="group relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft transition-all duration-300 hover:-translate-y-2 hover:border-accent/20 hover:shadow-xl">
                {/* Hover gradient wash */}
                <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-accent/0 to-accent/0 transition-all duration-500 group-hover:from-accent/3 group-hover:to-accent/8" />
                <div className="relative">
                  <div className="inline-flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-teal-600 text-white shadow-md shadow-accent/20 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-accent/35">
                    <pillar.icon className="size-7" />
                  </div>
                  <h3 className="mt-5 text-xl font-extrabold text-slate-950">{pillar.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{pillar.description}</p>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>

        {/* Location strip */}
        <RevealOnScroll className="mt-5">
          <div className="flex flex-wrap items-center gap-4 rounded-[1.75rem] border border-slate-200 bg-slate-50 px-7 py-5">
            <div className="flex items-center gap-2.5">
              <Clock3 className="size-4 shrink-0 text-accent" />
              <span className="text-sm font-bold uppercase tracking-[0.18em] text-slate-700">
                Location &amp; Access
              </span>
            </div>
            <div className="hidden h-4 w-px bg-slate-300 sm:block" />
            <p className="text-sm text-slate-500">{clinic.address}</p>
            <div className="hidden h-4 w-px bg-slate-300 sm:block" />
            <p className="text-sm text-slate-500">
              {doctors.filter((d) => d.isActive).length}+ active specialists
            </p>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}

function MissionBanner() {
  const values = [
    { label: "Excellence", icon: Star },
    { label: "Compassion", icon: HeartPulse },
    { label: "Integrity", icon: Shield },
  ];

  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8">
      <RevealOnScroll>
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2.25rem] bg-gradient-to-br from-slate-950 via-slate-900 to-[#0a2a28] shadow-2xl">
          {/* Accent top bar */}
          <div className="h-1 w-full bg-gradient-to-r from-accent via-[rgba(251,146,60,1)] to-accent" />

          <div className="px-8 py-12 sm:px-14 sm:py-16">
            <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-[0.3em] text-[rgba(251,146,60,1)]">
                  Our Mission
                </div>
                <h2 className="mt-4 max-w-2xl text-3xl font-extrabold leading-tight text-white sm:text-[2.5rem]">
                  Every patient deserves care that is{" "}
                  <span className="gradient-text">precise</span>,{" "}
                  <span className="text-[rgba(251,146,60,0.9)]">compassionate</span>, and{" "}
                  <span className="gradient-text">accessible</span>.
                </h2>
                <p className="mt-5 max-w-xl text-base leading-8 text-white/60">
                  We maintain the highest standards of clinical excellence while ensuring that patients
                  experience clarity, respect, and responsiveness — from first contact through ongoing care.
                </p>
              </div>

              <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col">
                {values.map((value) => (
                  <div
                    key={value.label}
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-sm transition-all duration-200 hover:border-accent/40 hover:bg-white/10"
                  >
                    <value.icon className="size-4 text-accent" />
                    <span className="text-sm font-semibold text-white/80">{value.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </RevealOnScroll>
    </section>
  );
}

function PatientJourney() {
  const items = [
    {
      step: "01",
      title: "Discover",
      description:
        "Patients get a clear understanding of the clinic, its standards, and its medical focus through a structured, credible digital presence.",
    },
    {
      step: "02",
      title: "Evaluate",
      description:
        "Doctors, services, and reputation can be reviewed without friction — each element is presented with clarity and confidence.",
    },
    {
      step: "03",
      title: "Proceed",
      description:
        "Booking becomes a confident next step rather than a leap of faith, supported by transparent information at every stage.",
    },
  ];

  return (
    <section className="px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <RevealOnScroll className="mb-12">
          <div className="text-[11px] font-bold uppercase tracking-[0.3em] text-accent">
            Patient Experience
          </div>
          <h2 className="mt-3 max-w-2xl text-3xl font-extrabold leading-tight text-slate-950 sm:text-[2.15rem]">
            A premium healthcare site guides patients with{" "}
            <span className="gradient-text">calm, structured clarity</span>
          </h2>
        </RevealOnScroll>

        <div className="relative grid gap-6 lg:grid-cols-3">
          {/* Connecting line on desktop */}
          <div className="pointer-events-none absolute left-0 right-0 top-[3.5rem] hidden h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent lg:block" />

          {items.map((item, index) => (
            <RevealOnScroll key={item.step} delay={index * 130}>
              <div className="group relative rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft transition-all duration-300 hover:-translate-y-2 hover:border-accent/20 hover:shadow-xl">
                {/* Step number badge */}
                <div className="mb-5 inline-flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-teal-600 shadow-md shadow-accent/20 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-accent/35">
                  <span className="text-sm font-extrabold text-white">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-slate-950">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
                <div className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-accent opacity-0 transition-all duration-300 group-hover:opacity-100">
                  <CheckCircle2 className="size-4" />
                  Key touchpoint
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>

        {/* CTA strip */}
        <RevealOnScroll className="mt-6">
          <div className="flex flex-col items-start justify-between gap-5 rounded-[2rem] border border-slate-200 bg-white px-8 py-7 shadow-soft sm:flex-row sm:items-center">
            <div>
              <div className="text-lg font-extrabold text-slate-950">
                Ready to experience the difference?
              </div>
              <p className="mt-1 text-sm text-slate-500">
                Book your appointment online — it takes less than a minute.
              </p>
            </div>
            <Link to="/booking" className="shrink-0">
              <Button className="shadow-accent-glow gap-2 px-6 py-3 transition-all duration-200 hover:-translate-y-0.5">
                Book Now <ArrowRight className="size-4" />
              </Button>
            </Link>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}

export function AboutPage() {
  return (
    <>
      <EmergencyBanner />
      <PremiumHero />
      <CareStandards />
      <MissionBanner />
      <PatientJourney />
      <ReviewsSection />
      <ClinicFooter />
      <WhatsAppFAB />
    </>
  );
}
