import { z } from "zod";

/**
 * Shared by the client form and the API route, so the browser and the server
 * enforce exactly the same rules. Client-side validation is a convenience —
 * the route re-validates because anything can POST to it.
 */
export const contactSchema = z.object({
  name: z.string().trim().min(2, "Tell me your name").max(80, "That is a very long name"),
  email: z.email("That does not look like an email address"),
  subject: z.string().trim().max(120, "Keep the subject under 120 characters").optional(),
  message: z
    .string()
    .trim()
    .min(20, "A little more detail helps — 20 characters minimum")
    .max(4000, "Keep it under 4000 characters"),
  /**
   * Honeypot. Hidden from humans via CSS and `tabindex=-1`; bots fill every
   * field they find, so a non-empty value means we drop the submission.
   *
   * Deliberately permissive here. If the schema rejected a filled honeypot,
   * the route would answer 400 and tell the bot which field gave it away —
   * the route instead accepts it and returns a plain 200 without sending.
   */
  company: z.string().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
