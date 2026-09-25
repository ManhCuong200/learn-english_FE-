'use client';

import Link from 'next/link';
import { LayoutDashboard, LogOut, Settings } from 'lucide-react';

import { Button } from '@/components/ui/button';

type SidebarItem = {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
};

type AppSidebarProps = {
  brand: string;
  items: SidebarItem[];
  activeHref: string;
  onSignOut: () => void;
  isSigningOut: boolean;
};

const AppSidebar = ({ brand, items, activeHref, onSignOut, isSigningOut }: AppSidebarProps) => {
  return (
    <aside className="hidden w-64 shrink-0 flex-col bg-sidebar px-5 py-7 text-sidebar-foreground lg:flex">
      <div className="flex items-center gap-3 px-3 text-sm font-semibold tracking-[0.16em] uppercase">
        <span className="grid size-9 place-items-center rounded-full bg-sidebar-primary text-lg font-bold text-sidebar-primary-foreground">e</span>
        {brand}
      </div>

      <nav className="mt-14 space-y-1 text-sm">
        {items.map(({ label, href, icon: Icon }) => (
          <Link
            key={label}
            href={href}
            className={`flex items-center gap-3 rounded-lg px-3 py-3 transition ${
              activeHref === href
                ? 'bg-sidebar-accent font-semibold text-sidebar-accent-foreground'
                : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
            }`}
          >
            <Icon className="size-4" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto space-y-1 text-sm">
        <Link href="#" className="flex items-center gap-3 rounded-lg px-3 py-3 text-sidebar-foreground/70 transition hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
          <Settings className="size-4" />
          Settings
        </Link>
        <Button type="button" variant="ghost" onClick={onSignOut} disabled={isSigningOut} className="h-auto w-full justify-start gap-3 px-3 py-3 font-normal text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
          <LogOut className="size-4" />
          {isSigningOut ? 'Signing out...' : 'Sign out'}
        </Button>
      </div>
    </aside>
  );
};

export { AppSidebar };
export type { SidebarItem };
