import { ArrowRight, CheckCircle2, Clock3, HeartHandshake, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import {
  ContactSection,
  HeroSection,
  ReviewsSection,
  RevealOnScroll,
  ServicesSection,
} from "../../components/public/Sections";
import { useClinic } from "../../context/ClinicContext";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { ClinicFooter, EmergencyBanner, WhatsAppFAB } from "./shared";

function HighlightsSection() {
  const { doctors, services } = useClinic();
  const activeDoctors = doctors.filter((doctor) => doctor.isActive).length;
  const activeServices = services.filter((service) => service.isActive).length;

  const items = [
    {
      title: "Trusted clinical team",
      description: `${activeDoctors}+ active specialists across core outpatient services.`,
      icon: ShieldCheck,
    },
    {
      title: "Fast appointment flow",
      description: "Patients can book online in less than a minute without calling the front desk.",
      icon: Clock3,
    },
    {
      title: "Full-service care",
      description: `${activeServices}+ treatment and consultation options with clear next steps.`,
      icon: HeartHandshake,
    },
  ];

  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-3">
        {items.map((item, index) => (
          <RevealOnScroll key={item.title} delay={index * 100}>
            <Card className="rounded-[2rem] p-7 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:ring-1 hover:ring-accent/15">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-teal-600 text-white shadow-md shadow-accent/20">
                <item.icon className="size-6" />
              </div>
              <h2 className="mt-5 text-xl font-extrabold text-ink">{item.title}</h2>
              <p className="mt-2 text-sm leading-7 text-slate-500">{item.description}</p>
            </Card>
          </RevealOnScroll>
        ))}
      </div>
    </section>
  );
}

function PublicSiteMap() {
  const pages = [
    {
      title: "About the Clinic",
      description: "Learn our care philosophy, see our facilities, and know what to expect at your first visit.",
      to: "/about",
    },
    {
      title: "Services",
      description: "Browse every treatment area with durations and clear pricing — then book in under a minute.",
      to: "/services",
    },
    {
      title: "Doctors",
      description: "View specialist credentials, read full doctor profiles, and book with your preferred physician.",
      to: "/doctors",
    },
    {
      title: "Contact",
      description: "Find our address, phone, WhatsApp, and working hours — all on one clean dedicated page.",
      to: "/contact",
    },
  ];

  return (
    <section className="px-4 py-14 sm:px-6 lg:px-8">
      <RevealOnScroll>
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#0f172a] via-[#0e1e32] to-[#0a1628] px-8 py-12 shadow-2xl sm:px-12">
          {/* Accent top bar */}
          <div className="-mx-8 -mt-12 mb-10 h-1 bg-gradient-to-r from-accent via-accent2 to-accent sm:-mx-12" />

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[0.3em] text-accent2">Clinic Website</div>
              <h2 className="mt-2 max-w-2xl text-3xl font-extrabold leading-tight text-white sm:text-4xl">
                A professional site that guides every visitor
              </h2>
            </div>
            <Link to="/booking">
              <Button variant="secondary" className="shrink-0 gap-2 transition-all duration-200 hover:-translate-y-0.5">
                Start Booking <ArrowRight className="size-4" />
              </Button>
            </Link>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {pages.map((page, index) => (
              <Link
                key={page.title}
                to={page.to}
                className="group rounded-[1.75rem] border border-white/10 bg-white/5 p-6 text-white transition-all duration-300 hover:-translate-y-1.5 hover:border-accent/30 hover:bg-white/10 hover:shadow-lg"
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center gap-3 text-accent2">
                  <CheckCircle2 className="size-5 transition-transform duration-200 group-hover:scale-110" />
                  <span className="text-sm font-bold uppercase tracking-[0.18em]">Dedicated Page</span>
                </div>
                <h3 className="mt-4 text-2xl font-extrabold">{page.title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/65">{page.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </RevealOnScroll>
    </section>
  );
}

export function LandingPage() {
  return (
    <>
      <EmergencyBanner />
      <HeroSection />
      <HighlightsSection />
      <ServicesSection />
      <PublicSiteMap />
      <ReviewsSection />
      <ContactSection />
      <ClinicFooter />
      <WhatsAppFAB />
    </>
  );
}
