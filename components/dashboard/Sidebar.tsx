'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, Activity, Database, Brain, Settings, ChevronRight, X, Zap
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
}

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Overview', icon: <LayoutDashboard className="h-4 w-4" /> },
  { href: '/dashboard/streams', label: 'Data Streams', icon: <Activity className="h-4 w-4" />, badge: '14' },
  { href: '/dashboard/models', label: 'AI Models', icon: <Brain className="h-4 w-4" /> },
  { href: '/dashboard/storage', label: 'Data Lake', icon: <Database className="h-4 w-4" /> },
  { href: '/dashboard/settings', label: 'Settings', icon: <Settings className="h-4 w-4" /> },
];

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

function NavLink({ item, pathname }: { item: NavItem; pathname: string }) {
  const isActive = pathname === item.href;
  return (
    <Link
      href={item.href}
      className={cn(
        'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 group',
        isActive
          ? 'bg-foreground text-background shadow-sm'
          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
      )}
    >
      <span className={cn('flex-shrink-0', isActive ? 'text-background' : 'text-muted-foreground group-hover:text-foreground')}>
        {item.icon}
      </span>
      <span className="flex-1 truncate">{item.label}</span>
      {item.badge && (
        <span className={cn(
          'text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center',
          isActive ? 'bg-background/20 text-background' : 'bg-foreground/10 text-foreground'
        )}>
          {item.badge}
        </span>
      )}
    </Link>
  );
}

export function Sidebar({ open = true, onClose }: SidebarProps) {
  const pathname = usePathname();

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-border/50 flex-shrink-0">
        <Link href="/" className="flex items-center gap-2 font-extrabold text-base text-foreground tracking-tight">
          <div className="h-7 w-7 rounded-lg bg-foreground text-background flex items-center justify-center text-sm font-black">N</div>
          Nexus
        </Link>
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 px-3 mb-2">Platform</p>
        {navItems.map((item) => (
          <NavLink key={item.href} item={item} pathname={pathname} />
        ))}
      </nav>

      {/* Bottom: Usage widget */}
      <div className="px-3 pb-4 flex-shrink-0">
        <div className="rounded-xl bg-muted/50 border border-border/40 p-3 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-foreground flex items-center gap-1.5">
              <Zap className="h-3 w-3" />
              API Usage
            </span>
            <span className="text-muted-foreground">3.8M / 5M</span>
          </div>
          <div className="h-1.5 w-full bg-border/50 rounded-full overflow-hidden">
            <div className="h-full w-[76%] bg-foreground rounded-full transition-all" />
          </div>
          <p className="text-[10px] text-muted-foreground">76% of monthly quota used</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop static sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-card border-r border-border/50 h-screen sticky top-0 flex-shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-[150] flex">
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
          <aside className="relative flex flex-col w-60 bg-card border-r border-border/50 h-full shadow-2xl z-10">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
