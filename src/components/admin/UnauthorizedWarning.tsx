'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft, AlertTriangle, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const UnauthorizedWarning = () => {
  const [clientIp, setClientIp] = useState<string>('127.0.0.1');
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    setCurrentTime(new Date().toLocaleString('vi-VN'));

    fetch('https://api.ipify.org?format=json')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.ip) {
          setClientIp(data.ip);
        }
      })
      .catch(() => {
        setClientIp('113.161.x.x (Client IP)');
      });
  }, []);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#0d0405] px-6 py-12 text-[#fee2e2]">
      {/* Background glowing ambient effects */}
      <div className="pointer-events-none absolute -top-40 -left-40 size-96 rounded-full bg-red-600/20 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 size-96 rounded-full bg-rose-700/20 blur-[120px]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.1)_0,transparent_75%)]" />

      <div className="relative z-10 w-full max-w-xl text-center">
        {/* Glowing Shield Icon */}
        <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-2xl border border-red-500/40 bg-red-950/80 shadow-[0_0_50px_rgba(225,29,72,0.4)] backdrop-blur-md animate-pulse">
          <ShieldAlert className="size-10 text-red-500" />
        </div>

        {/* Security Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-red-500/40 bg-red-950/90 px-4 py-1.5 text-xs font-bold tracking-widest text-red-400 uppercase shadow-inner">
          <AlertTriangle className="size-3.5 text-red-400 animate-bounce" />
          CẢNH BÁO NGUY HIỂM / SECURITY ALERT
        </div>

        {/* Heading */}
        <h1 className="mt-6 text-3xl font-black tracking-tight text-white sm:text-4xl">
          CẢNH BÁO: TRUY CẬP TRÁI PHÉP
        </h1>

        {/* Main Warning Box */}
        <div className="mt-6 rounded-2xl border border-red-500/40 bg-red-950/40 p-6 backdrop-blur-md shadow-2xl text-left space-y-4">
          <p className="text-base font-semibold leading-relaxed text-red-200">
            ⚠️ <span className="underline decoration-red-500 decoration-2 underline-offset-4 font-bold text-white">Cảnh báo:</span> Trang này chỉ dành cho Quản trị viên/Developer. Mọi hành vi cố tình truy cập đã bị ghi lại IP.
          </p>

          <div className="rounded-xl border border-red-900/60 bg-black/70 p-4 font-mono text-xs text-red-300/90 space-y-2">
            <div className="flex items-center justify-between border-b border-red-900/50 pb-2">
              <span className="flex items-center gap-1.5 text-red-400 font-semibold">
                <Terminal className="size-3.5" /> AUDIT_SECURITY_LOG
              </span>
              <span className="rounded bg-red-900/80 px-2 py-0.5 text-[10px] font-bold text-red-100">
                ACCESS_DENIED
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-slate-300">
              <div>
                <span className="text-red-400">Địa chỉ IP:</span> {clientIp}
              </div>
              <div>
                <span className="text-red-400">Thời gian:</span> {currentTime || 'Loading...'}
              </div>
              <div className="sm:col-span-2 truncate">
                <span className="text-red-400">Thiết bị:</span> {typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown'}
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-8 flex items-center justify-center">
          <Link href="/">
            <Button className="h-11 px-6 bg-red-600 font-bold text-white hover:bg-red-700 shadow-lg shadow-red-900/50 border border-red-500/50 cursor-pointer">
              <ArrowLeft className="mr-2 size-4" /> Quay về trang chủ
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
};
