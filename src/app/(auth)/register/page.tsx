'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRegister } from '@/app/(auth)/_hooks/useRegister';
import { registerSchema, type RegisterFormData, } from '@/validations/auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const RegisterPage = () => {
  const router = useRouter();
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (
    data: RegisterFormData,
  ): Promise<void> => {
    try {
      await registerMutation.mutateAsync(data);
      router.push('/login');
    } catch {
      // Error is displayed from registerMutation.error
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold tracking-tight">
            Create an account
          </h1>

          <p className="mt-3 text-base text-muted-foreground">
            Start learning English today.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          {/* Name */}
          <div className="space-y-2">
            <Label
              htmlFor="name"
              className="text-base font-medium"
            >
              Name
            </Label>

            <Input
              id="name"
              type="text"
              placeholder="Your name"
              autoComplete="name"
              disabled={registerMutation.isPending}
              {...register('name')}
              className="w-full rounded-lg border bg-background px-4 py-3.5 text-base outline-none transition focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />

            {errors.name && (
              <p className="text-sm text-destructive">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-base font-medium"
            >
              Email
            </Label>

            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              disabled={registerMutation.isPending}
              {...register('email')}
              className="w-full rounded-lg border bg-background px-4 py-3.5 text-base outline-none transition focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />

            {errors.email && (
              <p className="text-sm text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-base font-medium"
            >
              Password
            </Label>

            <Input
              id="password"
              type="password"
              placeholder="At least 8 characters"
              autoComplete="new-password"
              disabled={registerMutation.isPending}
              {...register('password')}
              className="w-full rounded-lg border bg-background px-4 py-3.5 text-base outline-none transition focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />

            {errors.password && (
              <p className="text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={registerMutation.isPending}
            className="w-full rounded-lg bg-primary px-4 py-3.5 text-base font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {registerMutation.isPending
              ? 'Creating account...'
              : 'Create account'}
          </Button>
        </form>

        {/* Login */}
        <p className="mt-8 text-center text-base text-muted-foreground">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-semibold text-foreground hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </main>
  );
};

export default RegisterPage;