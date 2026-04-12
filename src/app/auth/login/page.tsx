'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormData } from '@/schemas/auth';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'next/navigation';
import * as Checkbox from '@radix-ui/react-checkbox';
import { Eye, EyeOff, Loader2, Check } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const login = useAuthStore((state) => state.login);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { rememberMe: false }
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
      router.push('/dashboard');
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Email Address
        </label>
        <div className="mt-1 relative">
          <input
            id="email"
            type="email"
            autoComplete="email"
            {...register('email')}
            aria-invalid={errors.email ? 'true' : 'false'}
            aria-describedby={errors.email ? "email-error" : undefined}
            className="block w-full appearance-none rounded-lg border border-slate-300 dark:border-slate-700 px-3 py-2 placeholder-slate-400 dark:bg-slate-800 dark:text-white sm:text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          />
        </div>
        {errors.email && (
          <p id="email-error" role="alert" className="mt-2 text-sm text-red-600 dark:text-red-400">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Password
        </label>
        <div className="mt-1 relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            {...register('password')}
            aria-invalid={errors.password ? 'true' : 'false'}
            aria-describedby={errors.password ? "password-error" : undefined}
            className="block w-full appearance-none rounded-lg border border-slate-300 dark:border-slate-700 px-3 py-2 pr-10 placeholder-slate-400 dark:bg-slate-800 dark:text-white sm:text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-500 focus:outline-none focus:text-blue-500 rounded-r-lg"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
          >
            {showPassword ? <EyeOff className="h-5 w-5" aria-hidden="true" /> : <Eye className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
        {errors.password && (
          <p id="password-error" role="alert" className="mt-2 text-sm text-red-600 dark:text-red-400">
            {errors.password.message}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Checkbox.Root
            className="flex h-4 w-4 appearance-none items-center justify-center rounded border border-slate-300 bg-white dark:bg-slate-800 dark:border-slate-600 outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-900"
            id="rememberMe"
            onCheckedChange={(checked) => setValue('rememberMe', checked === true)}
          >
            <Checkbox.Indicator className="text-blue-600 dark:text-blue-400">
              <Check className="w-3 h-3" strokeWidth={3} />
            </Checkbox.Indicator>
          </Checkbox.Root>
          <label htmlFor="rememberMe" className="ml-2 block text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
            Remember me
          </label>
        </div>

        <div className="text-sm">
          <a href="#" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 outline-none focus:underline focus:ring-2 focus:ring-blue-500 rounded px-1">
            Forgot your password?
          </a>
        </div>
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
              Signing in...
            </>
          ) : (
            'Sign in'
          )}
        </button>
      </div>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-300 dark:border-slate-700" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white dark:bg-slate-900 px-2 text-slate-500">
              Don't have an account?
            </span>
          </div>
        </div>
        <div className="mt-6 flex justify-center">
          <Link 
            href="/auth/signup" 
            className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 focus:outline-none focus:underline focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
          >
            Create an account
          </Link>
        </div>
      </div>
    </form>
  );
}
