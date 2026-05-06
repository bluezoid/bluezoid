import { create } from "zustand";
import { devtools } from "zustand/middleware";

export type TimeSlot = {
  id: string;
  label: string;
  value: string;
  available: boolean;
};

export type BookingFormData = {
  name: string;
  email: string;
  company: string;
  service: string;
  budget: string;
  message: string;
  selectedDate: Date | undefined;
  selectedTime: string;
};

type BookingStep = "form" | "calendar" | "confirm" | "success";

type BookingState = {
  step: BookingStep;
  formData: BookingFormData;
  isSubmitting: boolean;
  submitError: string;

  setStep: (step: BookingStep) => void;
  setFormData: (data: Partial<BookingFormData>) => void;
  setSelectedDate: (date: Date | undefined) => void;
  setSelectedTime: (time: string) => void;
  setIsSubmitting: (v: boolean) => void;
  setSubmitError: (e: string) => void;
  reset: () => void;
};

const initialFormData: BookingFormData = {
  name: "",
  email: "",
  company: "",
  service: "",
  budget: "",
  message: "",
  selectedDate: undefined,
  selectedTime: "",
};

export const useBookingStore = create<BookingState>()(
  devtools(
    (set) => ({
      step: "form",
      formData: { ...initialFormData },
      isSubmitting: false,
      submitError: "",

      setStep: (step) => set({ step }),
      setFormData: (data) =>
        set((state) => ({ formData: { ...state.formData, ...data } })),
      setSelectedDate: (date) =>
        set((state) => ({
          formData: { ...state.formData, selectedDate: date, selectedTime: "" },
        })),
      setSelectedTime: (time) =>
        set((state) => ({
          formData: { ...state.formData, selectedTime: time },
        })),
      setIsSubmitting: (v) => set({ isSubmitting: v }),
      setSubmitError: (e) => set({ submitError: e }),
      reset: () =>
        set({ step: "form", formData: { ...initialFormData }, isSubmitting: false, submitError: "" }),
    }),
    { name: "booking-store" }
  )
);
