import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name too long"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters").max(200),
  message: z
    .string()
    .min(20, "Message must be at least 20 characters")
    .max(5000, "Message too long"),
});

export const subscribeSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export type ContactFormData = z.infer<typeof contactSchema>;
export type SubscribeFormData = z.infer<typeof subscribeSchema>;
