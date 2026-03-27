import { ArrowRight, Calendar, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { DoctorsSection, RevealOnScroll } from "../../components/public/Sections";
import { Card } from "../../components/ui/Card";
import { useClinic } from "../../context/ClinicContext";
import { Button } from "../../components/ui/Button";
import { ClinicFooter, EmergencyBanner, PublicPageHero, WhatsAppFAB } from "./shared";

function DoctorSummary() {
  const { doctors } = useClinic();
  const activeDoctors = doctors.filter((doctor) => doctor.isActive);

  return (
    <section className="relative px-4 pb-8 sm:px-6 lg:px-8">
      {/* Ambient blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-28 top-1/2 size-96 -translate-y-1/2 rounded-full bg-accent2/[0.055] blur-3xl" />
        <div className="absolute -left-20 bottom-0 size-72 rounded-full bg-accent/[0.05] blur-3xl" />
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <RevealOnScroll direction="left">
          <Card className="group relative overflow-hidden rounded-[2rem] p-8 sm:p-10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/60">
            {/* Shimmer sweep */}
            <div className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 transition-all duration-700 group-hover:translate-x-full group-hover:opacity-100" />
            {/* Decorative gradient top-right corner */}
            <div className="pointer-events-none absolute right-0 top-0 size-32 rounded-bl-[3rem] bg-gradient-to-bl from-accent2/[0.07] to-transparent" />

            <div className="text-[11px] font-bold uppercase tracking-[0.3em] text-accent2">Specialists</div>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight text-ink">
              Everything patients need to choose a doctor with confidence
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-600">
              Every profile shows specialization, qualifications, a full biography, and live availability — so patients can review the details and book with complete confidence.
            </p>

            {/* Bottom accent line */}
            <div className="absolute bottom-0 left-10 right-10 h-[2px] origin-left scale-x-0 rounded-full bg-gradient-to-r from-accent2 to-orange-400 transition-transform duration-500 group-hover:scale-x-100" />
          </Card>
        </RevealOnScroll>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
          <RevealOnScroll delay={130} direction="right">
            <Card className="group relative overflow-hidden rounded-[2rem] p-7 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-slate-200/60">
              <div className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/35 to-transparent opacity-0 transition-all duration-700 group-hover:translate-x-full group-hover:opacity-100" />

              <div className="relative inline-flex">
                <div className="absolute inset-0 animate-pulse-ring rounded-xl bg-accent2 opacity-30" />
                <div className="relative flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent2 to-orange-400 text-white shadow-md shadow-accent2/25 transition-transform duration-300 group-hover:scale-110">
                  <Users className="size-5" />
                </div>
              </div>

              <div className="mt-4 text-3xl font-extrabold gradient-text">{activeDoctors.length}+</div>
              <div className="mt-2 text-sm leading-7 text-slate-500">
                Specialist doctors with full profiles bookable directly from this page.
              </div>

              <div className="absolute bottom-0 left-7 right-7 h-[2px] origin-left scale-x-0 rounded-full bg-gradient-to-r from-accent2 to-orange-400 transition-transform duration-500 group-hover:scale-x-100" />
            </Card>
          </RevealOnScroll>

          <RevealOnScroll delay={260} direction="right">
            <Card className="group relative overflow-hidden rounded-[2rem] p-7 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-slate-200/60">
              <div className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/35 to-transparent opacity-0 transition-all duration-700 group-hover:translate-x-full group-hover:opacity-100" />

              <div className="relative inline-flex">
                <div className="absolute inset-0 animate-pulse-ring rounded-xl bg-accent opacity-30" />
                <div className="relative flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-teal-600 text-white shadow-md shadow-accent/25 transition-transform duration-300 group-hover:scale-110">
                  <Calendar className="size-5" />
                </div>
              </div>

              <div className="mt-4 text-3xl font-extrabold gradient-text">Live Slots</div>
              <div className="mt-2 text-sm leading-7 text-slate-500">
                Real-time availability shown on every profile — book the slot that works for you.
              </div>

              <div className="absolute bottom-0 left-7 right-7 h-[2px] origin-left scale-x-0 rounded-full bg-gradient-to-r from-accent to-teal-600 transition-transform duration-500 group-hover:scale-x-100" />
            </Card>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}

export function DoctorsOverviewPage() {
  return (
    <>
      <EmergencyBanner />
      <PublicPageHero
        eyebrow="Doctors"
        title="Meet the specialists who will care for you"
        description="Browse our team of experienced doctors, review their credentials and specializations, and book directly with the right specialist for your needs."
        actions={
          <>
            <Link to="/services">
              <Button variant="secondary">View Services</Button>
            </Link>
            <Link to="/booking">
              <Button className="gap-2">
                Book a Consultation
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          </>
        }
      />
      <DoctorSummary />
      <DoctorsSection />
      <ClinicFooter />
      <WhatsAppFAB />
    </>
  );
}
