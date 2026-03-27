import { useState } from "react";
import type { FormEvent } from "react";
import { ArrowRight, CheckCircle2, Mail, MapPin, Phone, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { ContactSection, RevealOnScroll } from "../../components/public/Sections";
import { Card } from "../../components/ui/Card";
import { useClinic } from "../../context/ClinicContext";
import { Button } from "../../components/ui/Button";
import { Input, Textarea } from "../../components/ui/Input";
import { ClinicFooter, EmergencyBanner, PublicPageHero, WhatsAppFAB } from "./shared";

function ContactHighlights() {
  const { clinic } = useClinic();

  const items = [
    {
      title: "Call us",
      value: clinic.phone,
      icon: Phone,
      href: `tel:${clinic.phone}`,
      gradient: "from-accent to-teal-600",
      shadow: "shadow-accent/25",
      ring: "bg-accent",
    },
    {
      title: "Email",
      value: clinic.email,
      icon: Mail,
      href: `mailto:${clinic.email}`,
      gradient: "from-accent2 to-orange-400",
      shadow: "shadow-accent2/25",
      ring: "bg-accent2",
    },
    {
      title: "Visit",
      value: clinic.address,
      icon: MapPin,
      href: undefined,
      gradient: "from-teal-500 to-accent",
      shadow: "shadow-teal-500/25",
      ring: "bg-teal-500",
    },
  ];

  return (
    <section className="relative px-4 pb-8 sm:px-6 lg:px-8">
      {/* Ambient blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-0 size-80 rounded-full bg-accent/[0.055] blur-3xl" />
        <div className="absolute -right-20 bottom-0 size-72 rounded-full bg-accent2/[0.05] blur-3xl" />
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
        {items.map((item, index) => {
          const inner = (
            <Card className="group relative overflow-hidden rounded-[2rem] p-7 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-slate-200/60">
              {/* Shimmer sweep */}
              <div className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/35 to-transparent opacity-0 transition-all duration-700 group-hover:translate-x-full group-hover:opacity-100" />

              {/* Icon with pulse ring */}
              <div className="relative inline-flex">
                <div className={`absolute inset-0 animate-pulse-ring rounded-2xl ${item.ring} opacity-30`} />
                <div
                  className={`relative flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br ${item.gradient} text-white shadow-md ${item.shadow} transition-transform duration-300 group-hover:scale-110`}
                >
                  <item.icon className="size-6" />
                </div>
              </div>

              <div className="mt-5 text-sm font-bold uppercase tracking-[0.18em] text-slate-400">{item.title}</div>
              <div className="mt-3 text-base font-semibold leading-7 text-ink">{item.value}</div>

              {/* Bottom accent line */}
              <div className={`absolute bottom-0 left-8 right-8 h-[2px] origin-left scale-x-0 rounded-full bg-gradient-to-r ${item.gradient} transition-transform duration-500 group-hover:scale-x-100`} />
            </Card>
          );

          return item.href ? (
            <RevealOnScroll key={item.title} delay={index * 110}>
              <a href={item.href} className="block">
                {inner}
              </a>
            </RevealOnScroll>
          ) : (
            <RevealOnScroll key={item.title} delay={index * 110}>
              {inner}
            </RevealOnScroll>
          );
        })}
      </div>
    </section>
  );
}

function ContactFormSection() {
  const { submitContactMessage } = useClinic();
  const [form, setForm] = useState({
    patientName: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submitContactMessage(form);
    setSubmitted(true);
    setForm({ patientName: "", phone: "", email: "", subject: "", message: "" });
  }

  return (
    <section className="relative px-4 pb-14 sm:px-6 lg:px-8">
      {/* Ambient blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute right-1/4 top-0 size-96 rounded-full bg-accent/[0.05] blur-3xl" />
        <div className="absolute bottom-0 left-1/3 size-80 rounded-full bg-accent2/[0.04] blur-3xl" />
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <RevealOnScroll direction="left">
          <Card className="group relative overflow-hidden rounded-[2rem] p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/60">
            {/* Decorative corner blob */}
            <div className="pointer-events-none absolute right-0 top-0 size-28 rounded-bl-[2.5rem] bg-gradient-to-bl from-accent/[0.08] to-transparent" />

            <div className="text-[11px] font-bold uppercase tracking-[0.3em] text-accent">Message the Clinic</div>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight text-ink">
              Have a question? We&rsquo;d love to hear from you.
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Use this form to get in touch with our team. We review every message and will get back to you as quickly as possible.
            </p>
            <div className="mt-6 rounded-[1.5rem] bg-canvas p-5 text-sm leading-7 text-slate-600">
              Best for appointment questions, service details, pricing enquiries, availability checks, and follow-up requests.
            </div>

            <div className="absolute bottom-0 left-8 right-8 h-[2px] origin-left scale-x-0 rounded-full bg-gradient-to-r from-accent to-teal-500 transition-transform duration-500 group-hover:scale-x-100" />
          </Card>
        </RevealOnScroll>

        <RevealOnScroll delay={140} direction="right">
          <Card className="rounded-[2rem] p-8 sm:p-10">
            {submitted ? (
              <div className="animate-bounce-in flex flex-col items-start">
                <div className="flex size-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-lg shadow-emerald-200/50">
                  <CheckCircle2 className="size-7" />
                </div>
                <h3 className="mt-5 text-2xl font-extrabold text-ink">Message sent</h3>
                <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600">
                  The inquiry has been saved and will now appear in the admin messages page for clinic staff.
                </p>
                <Button variant="secondary" className="mt-6 transition-all duration-200 hover:-translate-y-0.5" onClick={() => setSubmitted(false)}>
                  Send another message
                </Button>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    placeholder="Your name"
                    value={form.patientName}
                    onChange={(event) => updateField("patientName", event.target.value)}
                    required
                  />
                  <Input
                    placeholder="Phone number"
                    value={form.phone}
                    onChange={(event) => updateField("phone", event.target.value)}
                    required
                  />
                </div>
                <Input
                  type="email"
                  placeholder="Email address"
                  value={form.email}
                  onChange={(event) => updateField("email", event.target.value)}
                />
                <Input
                  placeholder="Subject"
                  value={form.subject}
                  onChange={(event) => updateField("subject", event.target.value)}
                  required
                />
                <Textarea
                  rows={6}
                  placeholder="Tell the clinic what you need help with"
                  value={form.message}
                  onChange={(event) => updateField("message", event.target.value)}
                  required
                />
                <Button
                  type="submit"
                  className="gap-2 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/20"
                  disabled={!form.patientName.trim() || !form.phone.trim() || !form.subject.trim() || !form.message.trim()}
                >
                  <Send className="size-4" />
                  Submit Message
                </Button>
              </form>
            )}
          </Card>
        </RevealOnScroll>
      </div>
    </section>
  );
}

export function ContactPage() {
  return (
    <>
      <EmergencyBanner />
      <PublicPageHero
        eyebrow="Contact"
        title="We're here whenever you need us"
        description="Reach us by phone, email, or the form below. Our team is ready to help with appointments, service questions, and everything in between."
        actions={
          <>
            <Link to="/booking">
              <Button className="gap-2">
                Book Appointment
                <ArrowRight className="size-4" />
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="secondary">About Clinic</Button>
            </Link>
          </>
        }
      />
      <ContactHighlights />
      <ContactFormSection />
      <ContactSection />
      <ClinicFooter />
      <WhatsAppFAB />
    </>
  );
}
