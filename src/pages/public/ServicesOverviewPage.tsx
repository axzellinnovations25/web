import { ArrowRight, CheckCircle2, Clock3, HeartPulse } from "lucide-react";
import { Link } from "react-router-dom";
import { RevealOnScroll, ServicesSection } from "../../components/public/Sections";
import { Card } from "../../components/ui/Card";
import { useClinic } from "../../context/ClinicContext";
import { Button } from "../../components/ui/Button";
import { ClinicFooter, EmergencyBanner, PublicPageHero, WhatsAppFAB } from "./shared";

function ServiceSummary() {
  const { services } = useClinic();
  const activeServices = services.filter((service) => service.isActive);

  const highlights = [
    {
      value: `${activeServices.length}+`,
      label: "Services",
      description: "Active treatment and consultation categories available for booking today.",
      icon: HeartPulse,
      iconGradient: "from-accent to-teal-600",
      iconShadow: "shadow-accent/25",
      ringColor: "bg-accent",
    },
    {
      value: "60 sec",
      label: "To book",
      description: "Select a service and complete your appointment in under a minute — no calls required.",
      icon: Clock3,
      iconGradient: "from-accent2 to-orange-400",
      iconShadow: "shadow-accent2/25",
      ringColor: "bg-accent2",
    },
    {
      value: "Instant",
      label: "Confirmation",
      description: "Every booking comes with immediate confirmation — date, time, and doctor details.",
      icon: CheckCircle2,
      iconGradient: "from-teal-500 to-accent",
      iconShadow: "shadow-teal-500/25",
      ringColor: "bg-teal-500",
    },
  ];

  return (
    <section className="relative px-4 pb-8 sm:px-6 lg:px-8">
      {/* Ambient blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 top-0 size-80 rounded-full bg-accent/[0.055] blur-3xl" />
        <div className="absolute -right-24 bottom-0 size-72 rounded-full bg-accent2/[0.055] blur-3xl" />
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
        {highlights.map((item, index) => (
          <RevealOnScroll key={item.label} delay={index * 110}>
            <Card className="group relative overflow-hidden rounded-[2rem] p-7 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-slate-200/60">
              {/* Shimmer sweep on hover */}
              <div className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/35 to-transparent opacity-0 transition-all duration-700 group-hover:translate-x-full group-hover:opacity-100" />

              {/* Icon with pulse ring */}
              <div className="relative inline-flex">
                <div className={`absolute inset-0 animate-pulse-ring rounded-2xl ${item.ringColor} opacity-30`} />
                <div
                  className={`relative flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br ${item.iconGradient} text-white shadow-md ${item.iconShadow} transition-transform duration-300 group-hover:scale-110`}
                >
                  <item.icon className="size-6" />
                </div>
              </div>

              <div className="mt-5 text-3xl font-extrabold gradient-text">{item.value}</div>
              <div className="mt-0.5 text-xs font-bold uppercase tracking-[0.15em] text-muted">{item.label}</div>
              <div className="mt-3 text-sm leading-7 text-slate-500">{item.description}</div>

              {/* Bottom accent line that grows on hover */}
              <div className="absolute bottom-0 left-8 right-8 h-[2px] origin-left scale-x-0 rounded-full bg-gradient-to-r from-accent to-teal-500 transition-transform duration-500 group-hover:scale-x-100" />
            </Card>
          </RevealOnScroll>
        ))}
      </div>
    </section>
  );
}

export function ServicesOverviewPage() {
  return (
    <>
      <EmergencyBanner />
      <PublicPageHero
        eyebrow="Services"
        title="Trusted treatments and consultations for every need"
        description="Browse our full range of clinical services — with clear descriptions, session durations, and transparent pricing — so you can choose and book with confidence."
        actions={
          <>
            <Link to="/doctors">
              <Button variant="secondary">Meet Doctors</Button>
            </Link>
            <Link to="/booking">
              <Button className="gap-2">
                Book Appointment
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          </>
        }
      />
      <ServiceSummary />
      <ServicesSection />
      <ClinicFooter />
      <WhatsAppFAB />
    </>
  );
}
