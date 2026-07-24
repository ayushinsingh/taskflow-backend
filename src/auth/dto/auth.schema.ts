import {z} from "zod";

export const signupSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.email(),
  password: z.string().min(8)
})

export type SignupDto = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8)
})

export type LoginDto = z.infer<typeof loginSchema>;
