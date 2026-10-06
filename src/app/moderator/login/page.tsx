'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ShieldCheck } from 'lucide-react';

import { useModeratorLogin } from '@/app/moderator/_hooks/useModeratorAuth';
import { useModeratorAuthContext } from '@/providers/ModeratorAuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { loginSchema, type LoginFormData } from '@/validations/auth';

const ModeratorLoginPage = () => {
  const router = useRouter();
  const { isAuthenticated } = useModeratorAuthContext();
  const loginMutation = useModeratorLogin();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'manhcuong@english-learning.local',
      password: 'CuongModerator2026!',
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/moderator/dashboard');
    }
  }, [isAuthenticated, router]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      await loginMutation.mutateAsync(data);
    } catch {
      // Error handled by mutation toast/state
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#17262b] px-6 py-12 text-[#f7f4eb]">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 text-sm font-bold tracking-[0.16em] uppercase">
            <span className="grid size-9 place-items-center rounded-full bg-[#f5c66f] text-lg text-[#17262b]">e</span>
            Eunoia Moderator
          </Link>
        </div>

        <div className="mt-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#f5c66f]/10 border border-[#f5c66f]/20 px-3 py-1 text-xs font-semibold text-[#f5c66f]">
            <ShieldCheck className="size-3.5" /> XÁC MINH QUYỀN DEVELOPER / MODERATOR
          </div>
          <h1 className="mt-3 font-display text-4xl leading-tight">Welcome back, Moderator.</h1>
          <p className="mt-3 leading-6 text-[#b9c7c4] text-sm">
            Cổng đăng nhập dành riêng cho Điều phối viên nội dung dự án Eunoia.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur sm:p-8">
          <div className="space-y-2">
            <Label htmlFor="moderator-email" className="text-[#f7f4eb]">Moderator email</Label>
            <Input id="moderator-email" type="email" autoComplete="username" {...register('email')} className="border-white/15 bg-white/10 text-[#f7f4eb] placeholder:text-[#aab9b5]" />
            {errors.email && <p className="text-sm text-red-300">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="moderator-password" className="text-[#f7f4eb]">Password</Label>
            <Input id="moderator-password" type="password" autoComplete="current-password" {...register('password')} className="border-white/15 bg-white/10 text-[#f7f4eb] placeholder:text-[#aab9b5]" />
            {errors.password && <p className="text-sm text-red-300">{errors.password.message}</p>}
          </div>
          <Button type="submit" disabled={isSubmitting || loginMutation.isPending} className="h-11 w-full bg-[#f5c66f] font-semibold text-[#17262b] hover:bg-[#f8d58e] cursor-pointer">
            {loginMutation.isPending ? 'Signing in...' : 'Sign in as moderator'}
          </Button>
        </form>

        <Link href="/" className="mt-6 inline-block text-sm text-[#b9c7c4] transition hover:text-white">
          ← Quay về trang chủ
        </Link>
      </div>
    </main>
  );
};

export default ModeratorLoginPage;
