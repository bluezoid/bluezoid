import { beforeEach, describe, expect, it } from "vitest";
import { useBookingStore } from "@/stores/booking-store";

describe("useBookingStore", () => {
  beforeEach(() => {
    useBookingStore.getState().reset();
  });

  it("starts at the form step with empty data", () => {
    const s = useBookingStore.getState();
    expect(s.step).toBe("form");
    expect(s.formData.name).toBe("");
    expect(s.formData.selectedDate).toBeUndefined();
  });

  it("advances step via setStep", () => {
    useBookingStore.getState().setStep("calendar");
    expect(useBookingStore.getState().step).toBe("calendar");
  });

  it("updates form fields via setFormData", () => {
    useBookingStore.getState().setFormData({ name: "Jane", email: "j@x.com" });
    const f = useBookingStore.getState().formData;
    expect(f.name).toBe("Jane");
    expect(f.email).toBe("j@x.com");
  });

  it("setSelectedDate clears selectedTime", () => {
    const d = new Date("2026-06-01");
    useBookingStore.getState().setFormData({ selectedTime: "10:00" });
    useBookingStore.getState().setSelectedDate(d);
    const f = useBookingStore.getState().formData;
    expect(f.selectedDate).toBe(d);
    expect(f.selectedTime).toBe("");
  });

  it("reset clears form + step + flags", () => {
    useBookingStore.getState().setFormData({ name: "Jane" });
    useBookingStore.getState().setStep("confirm");
    useBookingStore.getState().setIsSubmitting(true);
    useBookingStore.getState().setSubmitError("boom");
    useBookingStore.getState().reset();
    const s = useBookingStore.getState();
    expect(s.step).toBe("form");
    expect(s.formData.name).toBe("");
    expect(s.isSubmitting).toBe(false);
    expect(s.submitError).toBe("");
  });
});
