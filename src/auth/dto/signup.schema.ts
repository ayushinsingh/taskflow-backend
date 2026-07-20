import {z} from "zod";

export const signupSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.email(),
  password: z.string().min(8)
})

export interface SignupDto {
  name: string;
  email: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

// export type SignupDto = z.infer<typeof signupSchema>;