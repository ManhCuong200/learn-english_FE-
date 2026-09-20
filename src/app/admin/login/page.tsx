'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useAdminLogin } from '@/app/hooks/useAdminAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { loginSchema, type LoginFormData } from '@/lib/validations/auth';

const AdminLoginPage = () => {
  const loginMutation = useAdminLogin();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'admin@english-learning.local',
      password: 'EngLearnAdmin-2026-Reset!',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await loginMutation.mutateAsync(data);
    } catch {
      // The mutation error is rendered below.
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#17262b] px-6 py-12 text-[#f7f4eb]">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center gap-3 text-sm font-bold tracking-[0.16em] uppercase">
          <span className="grid size-9 place-items-center rounded-full bg-[#f5c66f] text-lg text-[#17262b]">e</span>
          Eunoia Admin
        </Link>

        <div className="mt-16">
          <p className="text-xs font-semibold tracking-[0.18em] text-[#f5c66f] uppercase">Restricted workspace</p>
          <h1 className="mt-3 font-display text-5xl leading-tight">Welcome back, admin.</h1>
          <p className="mt-4 leading-7 text-[#b9c7c4]">Manage the learning library, categories and vocabulary from one quiet workspace.</p>
        </div>

        {loginMutation.isError && (
          <div className="mt-8 rounded-lg border border-red-300/30 bg-red-300/10 px-4 py-3 text-sm text-red-100">
            {loginMutation.error.message}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur sm:p-8">
          <div className="space-y-2">
            <Label htmlFor="admin-email" className="text-[#f7f4eb]">Admin email</Label>
            <Input id="admin-email" type="email" autoComplete="username" {...register('email')} className="border-white/15 bg-white/10 text-[#f7f4eb] placeholder:text-[#aab9b5]" />
            {errors.email && <p className="text-sm text-red-200">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-password" className="text-[#f7f4eb]">Password</Label>
            <Input id="admin-password" type="password" autoComplete="current-password" {...register('password')} className="border-white/15 bg-white/10 text-[#f7f4eb] placeholder:text-[#aab9b5]" />
            {errors.password && <p className="text-sm text-red-200">{errors.password.message}</p>}
          </div>
          <Button type="submit" disabled={isSubmitting || loginMutation.isPending} className="h-11 w-full bg-[#f5c66f] font-semibold text-[#17262b] hover:bg-[#f8d58e]">
            {loginMutation.isPending ? 'Signing in...' : 'Sign in to admin'}
          </Button>
        </form>

        <Link href="/" className="mt-6 inline-block text-sm text-[#b9c7c4] transition hover:text-white">Back to public site</Link>
      </div>
    </main>
  );
};

export default AdminLoginPage;
