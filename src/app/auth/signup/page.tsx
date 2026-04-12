'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema, SignupFormData, calculatePasswordStrength } from '@/schemas/auth';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const signup = useAuthStore((state) => state.signup);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: 'onChange',
  });

  const passwordValue = watch('password', '');
  const strength = calculatePasswordStrength(passwordValue);

  const onSubmit = async (data: SignupFormData) => {
    try {
      await signup(data);
      router.push('/dashboard');
    } catch (error) {
      console.error('Signup failed', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Full Name
        </label>
        <div className="mt-1">
          <input
            id="fullName"
            type="text"
            {...register('fullName')}
            aria-invalid={errors.fullName ? 'true' : 'false'}
            aria-describedby={errors.fullName ? "fullName-error" : undefined}
            className="block w-full appearance-none rounded-lg border border-slate-300 dark:border-slate-700 px-3 py-2 placeholder-slate-400 dark:bg-slate-800 dark:text-white sm:text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          />
          {errors.fullName && (
            <p id="fullName-error" role="alert" className="mt-1 text-xs text-red-600 dark:text-red-400">
              {errors.fullName.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="organizationName" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Organization Name
        </label>
        <div className="mt-1">
          <input
            id="organizationName"
            type="text"
            {...register('organizationName')}
            aria-invalid={errors.organizationName ? 'true' : 'false'}
            aria-describedby={errors.organizationName ? "org-error" : undefined}
            className="block w-full appearance-none rounded-lg border border-slate-300 dark:border-slate-700 px-3 py-2 placeholder-slate-400 dark:bg-slate-800 dark:text-white sm:text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          />
          {errors.organizationName && (
            <p id="org-error" role="alert" className="mt-1 text-xs text-red-600 dark:text-red-400">
              {errors.organizationName.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Email Address
        </label>
        <div className="mt-1">
          <input
            id="email"
            type="email"
            {...register('email')}
            aria-invalid={errors.email ? 'true' : 'false'}
            aria-describedby={errors.email ? "email-error" : undefined}
            className="block w-full appearance-none rounded-lg border border-slate-300 dark:border-slate-700 px-3 py-2 placeholder-slate-400 dark:bg-slate-800 dark:text-white sm:text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          />
          {errors.email && (
            <p id="email-error" role="alert" className="mt-1 text-xs text-red-600 dark:text-red-400">
              {errors.email.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Password
        </label>
        <div className="mt-1 relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            {...register('password')}
            aria-invalid={errors.password ? 'true' : 'false'}
            aria-describedby={errors.password ? "password-error password-strength" : "password-strength"}
            className="block w-full appearance-none rounded-lg border border-slate-300 dark:border-slate-700 px-3 py-2 pr-10 placeholder-slate-400 dark:bg-slate-800 dark:text-white sm:text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-500 focus:outline-none focus:text-blue-500 rounded-r-lg"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
          >
            {showPassword ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
          </button>
        </div>
        
        {/* Real-time Password Strength Indicator */}
        <div className="mt-2 flex items-center justify-between" id="password-strength" aria-live="polite">
          <div className="flex gap-1 flex-1 mr-4">
            <div className={`h-1.5 flex-1 rounded-full ${passwordValue.length > 0 ? strength.color : 'bg-slate-200 dark:bg-slate-700'}`} />
            <div className={`h-1.5 flex-1 rounded-full ${strength.score >= 3 ? strength.color : 'bg-slate-200 dark:bg-slate-700'}`} />
            <div className={`h-1.5 flex-1 rounded-full ${strength.score >= 5 ? strength.color : 'bg-slate-200 dark:bg-slate-700'}`} />
          </div>
          <span className={`text-xs font-medium ${passwordValue.length > 0 ? strength.color.replace('bg-', 'text-').split(' ')[1] : 'text-slate-400'}`}>
            {passwordValue.length > 0 ? strength.label : 'Strength'}
          </span>
        </div>

        {errors.password && (
          <p id="password-error" role="alert" className="mt-1 text-xs text-red-600 dark:text-red-400">
            {errors.password.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Confirm Password
        </label>
        <div className="mt-1 relative">
          <input
            id="confirmPassword"
            type={showConfirm ? "text" : "password"}
            {...register('confirmPassword')}
            aria-invalid={errors.confirmPassword ? 'true' : 'false'}
            aria-describedby={errors.confirmPassword ? "confirm-error" : undefined}
            className="block w-full appearance-none rounded-lg border border-slate-300 dark:border-slate-700 px-3 py-2 pr-10 placeholder-slate-400 dark:bg-slate-800 dark:text-white sm:text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-500 focus:outline-none focus:text-blue-500 rounded-r-lg"
            onClick={() => setShowConfirm(!showConfirm)}
            aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
            aria-pressed={showConfirm}
          >
            {showConfirm ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p id="confirm-error" role="alert" className="mt-1 text-xs text-red-600 dark:text-red-400">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full justify-center rounded-lg border border-transparent bg-blue-600 py-2.5 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" aria-hidden="true" />
              Creating account...
            </>
          ) : (
            'Sign Up'
          )}
        </button>
      </div>

      <div className="mt-4 flex justify-center">
        <Link 
          href="/auth/login" 
          className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white focus:outline-none focus:underline focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 transition-colors"
        >
          Already have an account? Sign in
        </Link>
      </div>
    </form>
  );
}
