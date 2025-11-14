// validation.js
import { z } from "zod";

const nameRegex = /^[A-Za-z\s'-]+$/;
export const formSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .regex(nameRegex, "First name must contain only letters"),

  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .regex(nameRegex, "Last name must contain only letters"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});