'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/theme-toggle';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Header() {
  const pathname = usePathname();
  
  const navLinks = [
    { href: '/features', label: 'Features' },
    { href: '/testimonials', label: 'Testimonials' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/faq', label: 'FAQ' },
  ];

  return (
    <header className="fixed top-4 inset-x-0 z-50 flex justify-center w-full pointer-events-none">
      <div className="pointer-events-auto w-full max-w-5xl mx-4 sm:mx-8">
        <div className="glass-panel flex h-14 items-center justify-between rounded-full px-6 transition-all duration-300">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center space-x-2 rounded-full outline-offset-4 focus-visible:outline-2 focus-visible:outline-primary">
              <span className="font-extrabold text-lg text-foreground tracking-tight flex items-center gap-2">
                <div className="h-6 w-6 rounded-md bg-foreground text-background flex items-center justify-center">N</div>
                Nexus
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "transition-all hover:text-foreground relative tracking-tight",
                      isActive ? "text-foreground font-semibold" : ""
                    )}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-foreground rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)] dark:shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
               <ThemeToggle />
            </div>
            <Link
              href="/signup"
              className="hidden sm:inline-flex h-9 items-center justify-center rounded-full bg-foreground px-5 text-sm font-semibold text-background shadow-md transition-all hover:bg-foreground/90 hover:scale-105 active:scale-95"
            >
              Get Started
            </Link>
            <button className="md:hidden p-2 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full">
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
