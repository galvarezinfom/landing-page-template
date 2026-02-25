'use client';

import { useState } from 'react';
import { Bell, Menu, Search, ChevronDown } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { Badge } from '@/components/ui/Badge';

interface TopbarProps {
  onMenuClick?: () => void;
  pageTitle?: string;
  breadcrumbs?: { label: string; href?: string }[];
}

export function Topbar({ onMenuClick, pageTitle, breadcrumbs }: TopbarProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="flex items-center h-16 px-4 sm:px-6 gap-4 border-b border-border/50 bg-card flex-shrink-0 sticky top-0 z-40">
      {/* Mobile menu toggle */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Title / Breadcrumbs */}
      <div className="flex-1 min-w-0">
        {breadcrumbs && breadcrumbs.length > 0 ? (
          <nav className="flex items-center gap-1.5 text-sm">
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-muted-foreground/40">/</span>}
                <span className={i < breadcrumbs.length - 1 ? 'text-muted-foreground hover:text-foreground cursor-pointer' : 'font-semibold text-foreground'}>
                  {crumb.label}
                </span>
              </span>
            ))}
          </nav>
        ) : (
          <h1 className="text-sm font-semibold text-foreground truncate">{pageTitle}</h1>
        )}
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Search */}
        <button className="hidden sm:flex items-center gap-2 h-8 px-3 rounded-xl bg-muted/50 border border-border/40 text-xs text-muted-foreground hover:text-foreground hover:border-border transition-all">
          <Search className="h-3.5 w-3.5" />
          <span>Search...</span>
          <kbd className="hidden md:inline-flex h-4 items-center px-1.5 rounded border border-border/50 bg-muted text-[10px] font-mono">⌘K</kbd>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button className="relative p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500 ring-1 ring-background" />
          </button>
        </div>

        {/* Theme toggle */}
        <ThemeToggle />

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-muted transition-colors text-sm"
          >
            <div className="w-7 h-7 rounded-full bg-foreground text-background flex items-center justify-center text-xs font-bold flex-shrink-0">
              JD
            </div>
            <span className="hidden md:block text-sm font-medium text-foreground">Jane Doe</span>
            <ChevronDown className="hidden md:block h-3.5 w-3.5 text-muted-foreground" />
          </button>

          {showUserMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)} />
              <div className="absolute right-0 top-full mt-1 w-52 bg-card border border-border/50 rounded-xl shadow-lg z-20 overflow-hidden py-1">
                <div className="px-3 py-2 border-b border-border/40">
                  <p className="text-sm font-semibold text-foreground">Jane Doe</p>
                  <p className="text-xs text-muted-foreground">jane@acme.com</p>
                  <Badge variant="success" size="sm" className="mt-1">Startup Plan</Badge>
                </div>
                {[
                  { label: 'Account Settings' },
                  { label: 'Workspace' },
                  { label: 'API Keys' },
                  { label: 'Billing' },
                ].map((item) => (
                  <button key={item.label} className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                    {item.label}
                  </button>
                ))}
                <div className="border-t border-border/40 mt-1">
                  <button className="w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors">
                    Sign out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
