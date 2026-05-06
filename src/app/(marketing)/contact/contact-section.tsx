"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DayPicker } from "react-day-picker";
import { format, addDays, isWeekend } from "date-fns";
import {
  Mail, MapPin, Phone, Clock, CheckCircle2, ArrowRight, ArrowLeft,
  ChevronLeft, ChevronRight, Loader2, User, Building, MessageSquare
} from "lucide-react";
import { Section } from "@/components/shared/section";
import { useBookingStore } from "@/stores/booking-store";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import "react-day-picker/dist/style.css";

const TIME_SLOTS = [
  "08:30 AM", "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "12:00 PM",
  "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
  "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM",
  "06:00 PM", "06:30 PM", "07:00 PM", "07:30 PM", "08:00 PM",
];

const SERVICES = [
  "SaaS Development", "API & Backend", "Web Application",
  "AI Integration", "E-Commerce", "Tech Consulting", "Other",
];

const BUDGETS = [
  "Under ₹5L", "₹5L – ₹15L", "₹15L – ₹50L", "₹50L+", "Let's discuss",
];

const contactInfo = [
  { icon: Mail, label: "Email", value: siteConfig.contact.email, href: `mailto:${siteConfig.contact.email}` },
  { icon: Phone, label: "Phone", value: siteConfig.contact.phone, href: `tel:${siteConfig.contact.phone.replace(/\s/g, "")}` },
  { icon: MapPin, label: "Location", value: siteConfig.contact.address, href: null },
  { icon: Clock, label: "Response", value: "Within 24 hours", href: null },
];

const isUnavailable = (date: Date) => {
  if (isWeekend(date)) return true;
  if (date < new Date()) return true;
  return false;
};

// Step 1: Contact Details Form
function StepForm() {
  const { formData, setFormData, setStep } = useBookingStore();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.name.trim()) e.name = "Name is required";
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Valid email required";
    if (!formData.service) e.service = "Please select a service";
    if (!formData.message.trim() || formData.message.length < 20) e.message = "At least 20 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => { if (validate()) setStep("calendar"); };

  const field = (id: keyof typeof formData, label: string, icon: React.ReactNode, rest?: React.InputHTMLAttributes<HTMLInputElement>) => (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider text-white/40">{label}</label>
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30">{icon}</span>
        <input
          {...rest}
          value={formData[id] as string}
          onChange={(e) => setFormData({ [id]: e.target.value })}
          className={cn(
            "w-full rounded-xl border bg-white/4 py-3 pl-10 pr-4 text-sm text-white placeholder:text-white/20 outline-none transition-all",
            errors[id] ? "border-red-500/50 focus:border-red-400" : "border-white/10 focus:border-sky-500/50 focus:ring-2 focus:ring-sky-500/10"
          )}
        />
      </div>
      {errors[id] && <p className="text-xs text-red-400">{errors[id]}</p>}
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="space-y-5">
      <div>
        <h3 className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>Your Details</h3>
        <p className="text-xs text-white/35 mt-1">Step 1 of 3 — Tell us about yourself and your project</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {field("name", "Full Name", <User className="h-4 w-4" />, { placeholder: "Arjun Mehta" })}
        {field("email", "Email Address", <Mail className="h-4 w-4" />, { type: "email", placeholder: "arjun@company.com" })}
      </div>
      {field("company", "Company (optional)", <Building className="h-4 w-4" />, { placeholder: "Your Company" })}

      {/* Service selector */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-white/40">Service Needed</label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {SERVICES.map((s) => (
            <button key={s} type="button"
              onClick={() => setFormData({ service: s })}
              className={cn(
                "rounded-xl border px-3 py-2 text-xs font-medium text-left transition-all",
                formData.service === s
                  ? "border-sky-500/50 bg-sky-500/15 text-sky-300"
                  : "border-white/10 bg-white/3 text-white/50 hover:border-white/20 hover:text-white/70"
              )}
            >{s}</button>
          ))}
        </div>
        {errors.service && <p className="text-xs text-red-400">{errors.service}</p>}
      </div>

      {/* Budget */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-white/40">Budget Range</label>
        <div className="flex flex-wrap gap-2">
          {BUDGETS.map((b) => (
            <button key={b} type="button"
              onClick={() => setFormData({ budget: b })}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
                formData.budget === b
                  ? "border-sky-500/50 bg-sky-500/15 text-sky-300"
                  : "border-white/10 bg-white/3 text-white/40 hover:border-white/20 hover:text-white/60"
              )}
            >{b}</button>
          ))}
        </div>
      </div>

      {/* Message */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-white/40">Project Brief</label>
        <div className="relative">
          <MessageSquare className="absolute left-3.5 top-3.5 h-4 w-4 text-white/30" />
          <textarea
            rows={4}
            value={formData.message}
            onChange={(e) => setFormData({ message: e.target.value })}
            placeholder="Tell us what you're building, your timeline, and any key requirements..."
            className={cn(
              "w-full rounded-xl border bg-white/4 py-3 pl-10 pr-4 text-sm text-white placeholder:text-white/20 outline-none resize-none transition-all",
              errors.message ? "border-red-500/50" : "border-white/10 focus:border-sky-500/50 focus:ring-2 focus:ring-sky-500/10"
            )}
          />
        </div>
        {errors.message && <p className="text-xs text-red-400">{errors.message}</p>}
      </div>

      <button onClick={handleNext}
        className="group w-full overflow-hidden rounded-xl py-3.5 text-sm font-bold text-white transition-all hover:scale-[1.01]"
        style={{ background: "linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)", boxShadow: "0 0 30px #0ea5e920" }}
      >
        <span className="flex items-center justify-center gap-2">
          Pick a Time <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </button>
    </motion.div>
  );
}

// Step 2: Calendar + Time Picker
function StepCalendar() {
  const { formData, setSelectedDate, setSelectedTime, setStep } = useBookingStore();

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => setStep("form")} className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/50 hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h3 className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>Pick a Time</h3>
          <p className="text-xs text-white/35">Step 2 of 3 — Choose your preferred meeting slot</p>
        </div>
      </div>

      {/* Calendar */}
      <div className="flex justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/3">
        <style>{`
          .rdp { --rdp-accent-color: #0ea5e9; --rdp-background-color: #0ea5e920; color: white; margin: 0; padding: 1rem; width: 100%; }
          .rdp-month { width: 100%; }
          .rdp-table { width: 100%; border-collapse: collapse; }
          .rdp-caption { color: white; display: flex; justify-content: center; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; }
          .rdp-head_cell { color: rgba(255,255,255,0.3); font-size: 11px; font-weight: 600; text-align: center; padding: 0.25rem; }
          .rdp-cell { text-align: center; }
          .rdp-day { color: rgba(255,255,255,0.6); border-radius: 10px; width: 100%; aspect-ratio: 1; }
          .rdp-day:hover:not([disabled]) { background: rgba(14,165,233,0.15); color: white; }
          .rdp-day_selected { background: linear-gradient(135deg, #0ea5e9, #6366f1) !important; color: white !important; }
          .rdp-day_disabled { color: rgba(255,255,255,0.12) !important; }
          .rdp-day_today:not(.rdp-day_selected) { border: 1px solid rgba(14,165,233,0.4); color: #7dd3fc; }
          .rdp-nav_button { color: rgba(255,255,255,0.4); background: rgba(255,255,255,0.05); border-radius: 8px; }
          .rdp-nav_button:hover { background: rgba(255,255,255,0.1); color: white; }
        `}</style>
        <DayPicker
          mode="single"
          selected={formData.selectedDate}
          onSelect={setSelectedDate}
          disabled={isUnavailable}
          fromDate={addDays(new Date(), 1)}
          toDate={addDays(new Date(), 60)}
          components={{
            Chevron: ({ orientation }: { orientation?: string }) =>
              orientation === "left"
                ? <ChevronLeft className="h-4 w-4" />
                : <ChevronRight className="h-4 w-4" />,
          }}
        />
      </div>

      {/* Time slots */}
      <AnimatePresence>
        {formData.selectedDate && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/40">
              Available times · {format(formData.selectedDate, "EEE, MMM d")}
            </p>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {TIME_SLOTS.map((slot) => (
                <button key={slot} onClick={() => setSelectedTime(slot)}
                  className={cn(
                    "rounded-xl border px-2 py-2.5 text-xs font-semibold transition-all",
                    formData.selectedTime === slot
                      ? "border-sky-500/50 bg-sky-500/15 text-sky-300 shadow-sm shadow-sky-500/20"
                      : "border-white/10 bg-white/3 text-white/50 hover:border-white/20 hover:text-white/80"
                  )}
                >{slot}</button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setStep("confirm")}
        disabled={!formData.selectedDate || !formData.selectedTime}
        className="group w-full overflow-hidden rounded-xl py-3.5 text-sm font-bold text-white transition-all hover:scale-[1.01] disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ background: "linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)" }}
      >
        <span className="flex items-center justify-center gap-2">
          Review & Confirm <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </button>
    </motion.div>
  );
}

// Step 3: Confirm
function StepConfirm() {
  const { formData, setStep, setIsSubmitting, setSubmitError, isSubmitting, submitError, reset } = useBookingStore();
  const [done, setDone] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: `Booking Request: ${formData.service} | ${formData.selectedDate ? format(formData.selectedDate, "MMM d") : ""} ${formData.selectedTime}`,
          message: `Company: ${formData.company || "N/A"}\nService: ${formData.service}\nBudget: ${formData.budget || "Not specified"}\nPreferred Date: ${formData.selectedDate ? format(formData.selectedDate, "EEEE, MMMM d, yyyy") : "N/A"}\nPreferred Time: ${formData.selectedTime}\n\nProject Brief:\n${formData.message}`,
        }),
      });
      const j = await res.json();
      if (!res.ok || !j.ok) throw new Error(j.error?.message ?? "Submission failed");
      setDone(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (done) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center text-center py-10 gap-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-500/20">
          <CheckCircle2 className="h-10 w-10 text-emerald-400" />
        </div>
        <h3 className="text-2xl font-black text-white" style={{ fontFamily: "var(--font-display)" }}>Booking Confirmed!</h3>
        <p className="text-sm text-white/50 max-w-sm">We&apos;ve received your request and will send a calendar invite to <span className="text-sky-400">{formData.email}</span> shortly.</p>
        <button onClick={reset} className="mt-2 text-sm text-white/30 hover:text-white/60 transition-colors">Start over</button>
      </motion.div>
    );
  }

  const items = [
    { label: "Name", value: formData.name },
    { label: "Email", value: formData.email },
    { label: "Company", value: formData.company || "—" },
    { label: "Service", value: formData.service },
    { label: "Budget", value: formData.budget || "—" },
    { label: "Date", value: formData.selectedDate ? format(formData.selectedDate, "EEEE, MMMM d, yyyy") : "—" },
    { label: "Time", value: formData.selectedTime || "—" },
  ];

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => setStep("calendar")} className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/50 hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h3 className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>Review & Confirm</h3>
          <p className="text-xs text-white/35">Step 3 of 3 — Double-check your details</p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/3 divide-y divide-white/6 overflow-hidden">
        {items.map(({ label, value }) => (
          <div key={label} className="flex items-center justify-between px-4 py-3">
            <span className="text-xs text-white/35 uppercase tracking-wider font-semibold">{label}</span>
            <span className="text-sm text-white font-medium max-w-[60%] text-right">{value}</span>
          </div>
        ))}
      </div>

      {/* Brief preview */}
      {formData.message && (
        <div className="rounded-xl border border-white/10 bg-white/2 p-4">
          <p className="text-xs text-white/30 uppercase tracking-wider font-semibold mb-2">Brief</p>
          <p className="text-sm text-white/50 leading-relaxed line-clamp-3">{formData.message}</p>
        </div>
      )}

      {submitError && (
        <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">{submitError}</p>
      )}

      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="group w-full overflow-hidden rounded-xl py-3.5 text-sm font-bold text-white transition-all hover:scale-[1.01] disabled:opacity-60"
        style={{ background: "linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)", boxShadow: "0 0 30px #0ea5e920" }}
      >
        <span className="flex items-center justify-center gap-2">
          {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting...</> : <>Confirm Booking <CheckCircle2 className="h-4 w-4" /></>}
        </span>
      </button>
    </motion.div>
  );
}

// Step progress bar
function StepProgress({ step }: { step: string }) {
  const steps = [
    { id: "form", label: "Details" },
    { id: "calendar", label: "Schedule" },
    { id: "confirm", label: "Confirm" },
  ];
  const activeIdx = steps.findIndex((s) => s.id === step);
  return (
    <div className="mb-8 flex items-center gap-2">
      {steps.map((s, i) => (
        <div key={s.id} className="flex items-center gap-2 flex-1">
          <div className={cn(
            "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold transition-all",
            i < activeIdx ? "bg-sky-500 text-white" : i === activeIdx ? "bg-sky-500 text-white ring-4 ring-sky-500/20" : "border border-white/15 text-white/30"
          )}>
            {i < activeIdx ? <CheckCircle2 className="h-3 w-3" /> : i + 1}
          </div>
          <span className={cn("text-xs font-medium", i === activeIdx ? "text-white" : "text-white/30")}>{s.label}</span>
          {i < steps.length - 1 && <div className={cn("flex-1 h-px transition-all", i < activeIdx ? "bg-sky-500/50" : "bg-white/10")} />}
        </div>
      ))}
    </div>
  );
}

export function ContactSection() {
  const { step } = useBookingStore();

  return (
    <Section className="relative" style={{ background: "oklch(0.04 0.01 250)" }}>
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
        {/* Info panel */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          className="lg:col-span-2 flex flex-col gap-6"
        >
          <div>
            <h2 className="text-2xl font-black text-white" style={{ fontFamily: "var(--font-display)" }}>Contact Info</h2>
            <p className="mt-2 text-sm text-white/40 leading-relaxed">
              Ready to start? Drop a message or book a call — we respond within 24 hours with a tailored proposal.
            </p>
          </div>

          <div className="space-y-3">
            {contactInfo.map((info) => {
              const Icon = info.icon;
              return (
                <div key={info.label} className="flex items-center gap-4 rounded-xl glass-card p-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-500/10 border border-sky-500/20">
                    <Icon className="h-4 w-4 text-sky-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-white/30">{info.label}</p>
                    {info.href ? (
                      <a href={info.href} className="text-sm text-white hover:text-sky-400 transition-colors">{info.value}</a>
                    ) : (
                      <p className="text-sm text-white">{info.value}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick tip */}
          <div className="rounded-2xl border border-sky-500/15 bg-sky-500/5 p-5">
            <p className="text-xs font-semibold text-sky-400 mb-1">Pro tip</p>
            <p className="text-xs text-white/40 leading-relaxed">
              Include your budget range and desired launch date when booking — we&apos;ll come to the call with a tailored technical proposal ready.
            </p>
          </div>
        </motion.div>

        {/* Booking panel */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          className="lg:col-span-3 glass-card rounded-3xl p-6 md:p-8"
        >
          <StepProgress step={step} />
          <AnimatePresence mode="wait">
            {step === "form" && <StepForm key="form" />}
            {step === "calendar" && <StepCalendar key="calendar" />}
            {step === "confirm" && <StepConfirm key="confirm" />}
          </AnimatePresence>
        </motion.div>
      </div>
    </Section>
  );
}
