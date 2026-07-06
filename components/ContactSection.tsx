"use client";

import { useMemo, useState } from "react";
import SectionHeader from "./SectionHeader";

const SERVICES = [
  "SAAS DEVELOPMENT",
  "API & BACKEND",
  "WEB APPLICATION",
  "AI INTEGRATION",
  "E-COMMERCE",
  "TECH CONSULTING",
  "OTHER",
];

const BUDGETS = ["UNDER ₹5L", "₹5L – ₹15L", "₹15L – ₹50L", "₹50L+", "LET'S DISCUSS"];

const TIME_SLOTS = [
  "08:30 AM", "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "12:00 PM",
  "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
  "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM",
  "06:00 PM", "06:30 PM", "07:00 PM", "07:30 PM", "08:00 PM",
];

const contactInfo = [
  { label: "EMAIL", value: "hello@bluezoid.in", href: "mailto:hello@bluezoid.in" },
  { label: "LOCATION", value: "Kolkata, West Bengal, India (Remote)", href: null },
  { label: "RESPONSE", value: "Within 24 hours", href: null },
];

interface FormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  budget: string;
  message: string;
}

const EMPTY_FORM: FormData = {
  name: "",
  email: "",
  phone: "",
  company: "",
  service: "",
  budget: "",
  message: "",
};

type Step = "details" | "schedule" | "confirm" | "success";

const MONTH_NAMES = [
  "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
  "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER",
];
const WEEKDAY_NAMES = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];

function startOfDay(d: Date) {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function isUnavailable(date: Date, today: Date, maxDate: Date) {
  const day = date.getDay();
  if (day === 0 || day === 6) return true; // weekend
  if (date < today) return true;
  if (date > maxDate) return true;
  return false;
}

function formatLongDate(d: Date) {
  const WD = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const M = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return `${WD[d.getDay()]}, ${M[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

function inputCls(hasError?: boolean) {
  return `h-[46px] px-4 w-full bg-[#0A0A0A] border font-ibm-mono text-[13px] text-[#F5F5F0] placeholder:text-[#444444] outline-none transition-colors ${
    hasError ? "border-red-500/60" : "border-[#3D3D3D] focus:border-[#FFD600]"
  }`;
}

function labelCls() {
  return "font-ibm-mono text-[10px] font-bold text-[#888888] tracking-[1.5px]";
}

function StepProgress({ step }: { step: Step }) {
  const steps: { id: Step; label: string }[] = [
    { id: "details", label: "DETAILS" },
    { id: "schedule", label: "SCHEDULE" },
    { id: "confirm", label: "CONFIRM" },
  ];
  const activeIdx = steps.findIndex((s) => s.id === step);

  return (
    <div className="mb-10 flex items-center gap-2">
      {steps.map((s, i) => (
        <div key={s.id} className="flex flex-1 items-center gap-2">
          <div
            className="flex h-7 w-7 shrink-0 items-center justify-center font-ibm-mono text-[10px] font-bold transition-colors"
            style={{
              backgroundColor: i <= activeIdx ? "#FFD600" : "transparent",
              color: i <= activeIdx ? "#0A0A0A" : "#555555",
              border: i <= activeIdx ? "none" : "1px solid #3D3D3D",
            }}
          >
            {i < activeIdx ? "✓" : i + 1}
          </div>
          <span
            className="font-ibm-mono text-[10px] tracking-[1.5px]"
            style={{ color: i <= activeIdx ? "#F5F5F0" : "#555555" }}
          >
            {s.label}
          </span>
          {i < steps.length - 1 && (
            <div
              className="h-[1px] flex-1 transition-colors"
              style={{ backgroundColor: i < activeIdx ? "#FFD600" : "#2D2D2D" }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default function ContactSection() {
  const [step, setStep] = useState<Step>("details");
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [viewMonth, setViewMonth] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const today = useMemo(() => startOfDay(new Date()), []);
  const maxDate = useMemo(() => {
    const d = new Date(today);
    d.setDate(d.getDate() + 60);
    return d;
  }, [today]);
  const tomorrow = useMemo(() => {
    const d = new Date(today);
    d.setDate(d.getDate() + 1);
    return d;
  }, [today]);

  const validateDetails = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Valid email required";
    if (!form.phone.trim()) e.phone = "Mobile number is required";
    if (!form.service) e.service = "Please select a service";
    if (!form.message.trim() || form.message.trim().length < 20) e.message = "At least 20 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const calendarCells = useMemo(() => {
    const year = viewMonth.getFullYear();
    const month = viewMonth.getMonth();
    const firstDayOfWeek = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: (Date | null)[] = [];
    for (let i = 0; i < firstDayOfWeek; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
    return cells;
  }, [viewMonth]);

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError("");
    try {
      const subject = `Booking Request: ${form.service} | ${selectedDate ? formatLongDate(selectedDate) : ""} ${selectedTime}`;
      const message = `Company: ${form.company || "N/A"}\nMobile: ${form.phone}\nService: ${form.service}\nBudget: ${form.budget || "Not specified"}\nPreferred Date: ${selectedDate ? formatLongDate(selectedDate) : "N/A"}\nPreferred Time: ${selectedTime}\n\nProject Brief:\n${form.message}`;

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          subject,
          message,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Submission failed");
      setStep("success");
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="flex flex-col w-full bg-[#0A0A0A] py-16 px-6 md:py-[100px] md:px-[120px] gap-12 md:gap-[64px]">
      <SectionHeader
        label="[10] // CONTACT"
        title={"LET'S BUILD YOUR\nNEXT BIG THING."}
        subtitle="FILL IN YOUR DETAILS AND BOOK A TIME THAT WORKS FOR YOU. WE'LL COME PREPARED WITH INSIGHTS SPECIFIC TO YOUR PROJECT."
      />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-[24px]">
        {/* Info panel */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div>
            <h3 className="font-grotesk text-[20px] font-bold text-[#F5F5F0] tracking-[0.5px]">
              CONTACT INFO
            </h3>
            <p className="mt-2 font-ibm-mono text-[12px] text-[#666666] tracking-[0.5px] leading-relaxed">
              READY TO START? DROP A MESSAGE OR BOOK A CALL — WE RESPOND WITHIN 24 HOURS WITH A TAILORED PROPOSAL.
            </p>
          </div>

          <div className="flex flex-col gap-[2px]">
            {contactInfo.map((info) => (
              <div key={info.label} className="flex flex-col gap-1 p-5 bg-[#111111] border border-[#2D2D2D]">
                <span className="font-ibm-mono text-[10px] font-bold text-[#555555] tracking-[2px]">
                  {info.label}
                </span>
                {info.href ? (
                  <a href={info.href} className="font-ibm-mono text-[13px] text-[#F5F5F0] hover:text-[#FFD600] transition-colors">
                    {info.value}
                  </a>
                ) : (
                  <span className="font-ibm-mono text-[13px] text-[#F5F5F0]">{info.value}</span>
                )}
              </div>
            ))}
          </div>

          <div className="p-5 bg-[#1A1A1A] border border-[#FFD600]/30">
            <p className="font-ibm-mono text-[11px] font-bold text-[#FFD600] tracking-[2px] mb-2">
              [ PRO TIP ]
            </p>
            <p className="font-ibm-mono text-[11px] text-[#888888] tracking-[0.5px] leading-relaxed">
              INCLUDE YOUR BUDGET RANGE AND DESIRED LAUNCH DATE WHEN BOOKING — WE&apos;LL COME TO THE CALL WITH A TAILORED TECHNICAL PROPOSAL READY.
            </p>
          </div>
        </div>

        {/* Booking panel */}
        <div className="lg:col-span-3 p-6 md:p-10 bg-[#111111] border-2 border-[#2D2D2D]">
          {step !== "success" && <StepProgress step={step} />}

          {step === "details" && (
            <div className="flex flex-col gap-5">
              <div>
                <h3 className="font-grotesk text-[16px] font-bold text-[#F5F5F0]">YOUR DETAILS</h3>
                <p className="mt-1 font-ibm-mono text-[11px] text-[#666666]">
                  STEP 1 OF 3 — TELL US ABOUT YOURSELF AND YOUR PROJECT
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className={labelCls()}>FULL NAME *</label>
                  <input className={inputCls(!!errors.name)} placeholder="Arjun Mehta" value={form.name} onChange={(e) => set("name", e.target.value)} />
                  {errors.name && <p className="font-ibm-mono text-[10px] text-red-400">{errors.name}</p>}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className={labelCls()}>EMAIL ADDRESS *</label>
                  <input type="email" className={inputCls(!!errors.email)} placeholder="arjun@company.com" value={form.email} onChange={(e) => set("email", e.target.value)} />
                  {errors.email && <p className="font-ibm-mono text-[10px] text-red-400">{errors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className={labelCls()}>MOBILE NUMBER *</label>
                  <input type="tel" className={inputCls(!!errors.phone)} placeholder="+91 98765 43210" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
                  {errors.phone && <p className="font-ibm-mono text-[10px] text-red-400">{errors.phone}</p>}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className={labelCls()}>COMPANY (OPTIONAL)</label>
                  <input className={inputCls()} placeholder="Your Company" value={form.company} onChange={(e) => set("company", e.target.value)} />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className={labelCls()}>SERVICE NEEDED</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {SERVICES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => set("service", s)}
                      className="px-3 py-2.5 text-left font-ibm-mono text-[10px] font-bold tracking-[0.5px] border transition-colors"
                      style={{
                        borderColor: form.service === s ? "#FFD600" : "#3D3D3D",
                        backgroundColor: form.service === s ? "#1A1A1A" : "transparent",
                        color: form.service === s ? "#FFD600" : "#888888",
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                {errors.service && <p className="font-ibm-mono text-[10px] text-red-400">{errors.service}</p>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className={labelCls()}>BUDGET RANGE</label>
                <div className="flex flex-wrap gap-2">
                  {BUDGETS.map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => set("budget", b)}
                      className="px-3 py-1.5 font-ibm-mono text-[10px] font-bold tracking-[0.5px] border transition-colors"
                      style={{
                        borderColor: form.budget === b ? "#FFD600" : "#3D3D3D",
                        backgroundColor: form.budget === b ? "#1A1A1A" : "transparent",
                        color: form.budget === b ? "#FFD600" : "#888888",
                      }}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className={labelCls()}>PROJECT BRIEF</label>
                <textarea
                  rows={4}
                  className={inputCls(!!errors.message) + " h-auto py-3 resize-y"}
                  placeholder="Tell us what you're building, your timeline, and any key requirements..."
                  value={form.message}
                  onChange={(e) => set("message", e.target.value)}
                />
                {errors.message && <p className="font-ibm-mono text-[10px] text-red-400">{errors.message}</p>}
              </div>

              <button
                type="button"
                onClick={() => { if (validateDetails()) setStep("schedule"); }}
                className="flex items-center justify-center h-[52px] bg-[#FFD600] hover:bg-[#e6c200] transition-colors mt-2"
              >
                <span className="font-grotesk text-[12px] font-bold text-[#0A0A0A] tracking-[2px]">
                  PICK A TIME &gt;
                </span>
              </button>
            </div>
          )}

          {step === "schedule" && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <button onClick={() => setStep("details")} className="flex h-8 w-8 items-center justify-center border border-[#3D3D3D] text-[#888888] hover:text-[#F5F5F0] hover:border-[#888888] transition-colors">
                  &lt;
                </button>
                <div>
                  <h3 className="font-grotesk text-[16px] font-bold text-[#F5F5F0]">PICK A TIME</h3>
                  <p className="font-ibm-mono text-[11px] text-[#666666]">STEP 2 OF 3 — CHOOSE YOUR PREFERRED MEETING SLOT</p>
                </div>
              </div>

              {/* Calendar */}
              <div className="border border-[#2D2D2D] bg-[#0A0A0A] p-5">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-grotesk text-[14px] font-bold text-[#F5F5F0] tracking-[1px]">
                    {MONTH_NAMES[viewMonth.getMonth()]} {viewMonth.getFullYear()}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setViewMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1))}
                      className="flex h-7 w-7 items-center justify-center border border-[#3D3D3D] text-[#888888] hover:text-[#F5F5F0] hover:border-[#888888] transition-colors"
                    >
                      &lt;
                    </button>
                    <button
                      onClick={() => setViewMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1))}
                      className="flex h-7 w-7 items-center justify-center border border-[#3D3D3D] text-[#888888] hover:text-[#F5F5F0] hover:border-[#888888] transition-colors"
                    >
                      &gt;
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-2">
                  {WEEKDAY_NAMES.map((w) => (
                    <span key={w} className="font-ibm-mono text-[9px] font-bold text-[#555555] text-center tracking-[0.5px]">
                      {w}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {calendarCells.map((date, i) => {
                    if (!date) return <div key={i} />;
                    const disabled = isUnavailable(date, tomorrow, maxDate);
                    const selected = selectedDate && startOfDay(selectedDate).getTime() === startOfDay(date).getTime();
                    return (
                      <button
                        key={i}
                        disabled={disabled}
                        onClick={() => { setSelectedDate(date); setSelectedTime(""); }}
                        className="aspect-square font-ibm-mono text-[11px] transition-colors"
                        style={{
                          backgroundColor: selected ? "#FFD600" : "transparent",
                          color: disabled ? "#2D2D2D" : selected ? "#0A0A0A" : "#AAAAAA",
                          fontWeight: selected ? 700 : 400,
                          cursor: disabled ? "not-allowed" : "pointer",
                        }}
                      >
                        {date.getDate()}
                      </button>
                    );
                  })}
                </div>
              </div>

              {selectedDate && (
                <div>
                  <p className="mb-3 font-ibm-mono text-[10px] font-bold text-[#888888] tracking-[1.5px]">
                    AVAILABLE TIMES · {formatLongDate(selectedDate).toUpperCase()}
                  </p>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {TIME_SLOTS.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setSelectedTime(slot)}
                        className="px-2 py-2.5 font-ibm-mono text-[10px] font-bold border transition-colors"
                        style={{
                          borderColor: selectedTime === slot ? "#FFD600" : "#3D3D3D",
                          backgroundColor: selectedTime === slot ? "#1A1A1A" : "transparent",
                          color: selectedTime === slot ? "#FFD600" : "#888888",
                        }}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => setStep("confirm")}
                disabled={!selectedDate || !selectedTime}
                className="flex items-center justify-center h-[52px] bg-[#FFD600] hover:bg-[#e6c200] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span className="font-grotesk text-[12px] font-bold text-[#0A0A0A] tracking-[2px]">
                  REVIEW &amp; CONFIRM &gt;
                </span>
              </button>
            </div>
          )}

          {step === "confirm" && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <button onClick={() => setStep("schedule")} className="flex h-8 w-8 items-center justify-center border border-[#3D3D3D] text-[#888888] hover:text-[#F5F5F0] hover:border-[#888888] transition-colors">
                  &lt;
                </button>
                <div>
                  <h3 className="font-grotesk text-[16px] font-bold text-[#F5F5F0]">REVIEW &amp; CONFIRM</h3>
                  <p className="font-ibm-mono text-[11px] text-[#666666]">STEP 3 OF 3 — DOUBLE-CHECK YOUR DETAILS</p>
                </div>
              </div>

              <div className="flex flex-col border border-[#2D2D2D] divide-y divide-[#2D2D2D]">
                {[
                  { label: "NAME", value: form.name },
                  { label: "EMAIL", value: form.email },
                  { label: "MOBILE", value: form.phone },
                  { label: "COMPANY", value: form.company || "—" },
                  { label: "SERVICE", value: form.service },
                  { label: "BUDGET", value: form.budget || "—" },
                  { label: "DATE", value: selectedDate ? formatLongDate(selectedDate) : "—" },
                  { label: "TIME", value: selectedTime || "—" },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between px-4 py-3 bg-[#0A0A0A]">
                    <span className="font-ibm-mono text-[10px] font-bold text-[#555555] tracking-[1.5px]">{row.label}</span>
                    <span className="font-ibm-mono text-[12px] text-[#F5F5F0] text-right max-w-[60%]">{row.value}</span>
                  </div>
                ))}
              </div>

              {form.message && (
                <div className="p-4 bg-[#0A0A0A] border border-[#2D2D2D]">
                  <p className="font-ibm-mono text-[10px] font-bold text-[#555555] tracking-[1.5px] mb-2">BRIEF</p>
                  <p className="font-ibm-mono text-[12px] text-[#888888] leading-relaxed line-clamp-3">{form.message}</p>
                </div>
              )}

              {submitError && (
                <p className="p-3 border border-red-500/30 bg-red-500/10 font-ibm-mono text-[11px] text-red-400">
                  {submitError}
                </p>
              )}

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center justify-center h-[52px] bg-[#FFD600] hover:bg-[#e6c200] transition-colors disabled:opacity-60"
              >
                <span className="font-grotesk text-[12px] font-bold text-[#0A0A0A] tracking-[2px]">
                  {submitting ? "SUBMITTING..." : "CONFIRM BOOKING ✓"}
                </span>
              </button>
            </div>
          )}

          {step === "success" && (
            <div className="flex flex-col items-center text-center gap-4 py-10">
              <div className="flex h-16 w-16 items-center justify-center border-2 border-[#FFD600] bg-[#1A1A1A]">
                <span className="font-grotesk text-[28px] font-bold text-[#FFD600]">✓</span>
              </div>
              <h3 className="font-grotesk text-[22px] font-bold text-[#F5F5F0]">BOOKING CONFIRMED!</h3>
              <p className="font-ibm-mono text-[12px] text-[#888888] max-w-sm leading-relaxed">
                WE&apos;VE RECEIVED YOUR REQUEST AND WILL SEND A CALENDAR INVITE TO{" "}
                <span className="text-[#FFD600]">{form.email}</span> SHORTLY.
              </p>
              <button
                onClick={() => {
                  setForm(EMPTY_FORM);
                  setSelectedDate(null);
                  setSelectedTime("");
                  setStep("details");
                }}
                className="mt-2 font-ibm-mono text-[11px] text-[#555555] hover:text-[#F5F5F0] transition-colors tracking-[1px]"
              >
                START OVER
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
