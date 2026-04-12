import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const signupSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  organizationName: z.string().min(2, 'Organization name must be at least 2 characters'),
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"], // sets the error path
});

export type SignupFormData = z.infer<typeof signupSchema>;

// Shared util for mapping password strength
export const calculatePasswordStrength = (password: string) => {
  let score = 0;
  if (!password) return { score: 0, label: 'Weak', color: 'bg-slate-200 text-slate-500' };
  
  if (password.length > 7) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 2) return { score, label: 'Weak', color: 'bg-red-500 text-red-700' };
  if (score <= 4) return { score, label: 'Medium', color: 'bg-orange-500 text-orange-700' };
  return { score, label: 'Strong', color: 'bg-emerald-500 text-emerald-700' };
};
