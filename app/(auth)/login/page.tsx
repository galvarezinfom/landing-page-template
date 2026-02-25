'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, Github } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="w-full flex min-h-screen relative">
      {/* Left decorative panel - hidden on mobile */}
      <div className="hidden lg:flex lg:flex-1 relative overflow-hidden bg-foreground text-background flex-col justify-between p-16">
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-foreground via-transparent to-transparent pointer-events-none"></div>

        {/* Top quote */}
        <div className="relative z-10 space-y-3">
          <div className="text-background/40 text-sm font-mono tracking-widest uppercase">Nexus Platform</div>
        </div>

        {/* Center content */}
        <div className="relative z-10 space-y-6">
          <div className="flex items-start gap-4">
            <div className="text-5xl leading-tight font-extrabold text-background/90 tracking-tight max-w-sm">
              Your data, <span className="text-background/50">augmented</span> by intelligence.
            </div>
          </div>
          
          {/* Mock mini-stats */}
          <div className="flex gap-8 pt-4">
            {[
              { label: 'API Uptime', value: '99.99%' },
              { label: 'Avg Latency', value: '< 40ms' },
              { label: 'Data Points', value: '1.2T+' },
            ].map((stat) => (
              <div key={stat.label} className="space-y-1">
                <div className="text-2xl font-extrabold text-background">{stat.value}</div>
                <div className="text-xs text-background/50 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom customer quote */}
        <div className="relative z-10 border-t border-white/10 pt-8">
          <blockquote className="text-sm text-background/60 italic leading-relaxed">
            "Nexus is the backbone of our entire analytics infrastructure. It just works."
          </blockquote>
          <div className="mt-3 text-xs text-background/40 font-semibold">— Sarah K., VP of Engineering at QuantumOps</div>
        </div>
      </div>

      {/* Right panel: Form */}
      <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-16 xl:px-24 relative z-10 max-w-xl lg:max-w-none mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md mx-auto space-y-8"
        >
          <div className="space-y-2">
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
              Sign in to Nexus
            </h2>
            <p className="text-sm text-muted-foreground font-medium">
              Don't have an account?{' '}
              <Link href="/signup" className="font-semibold text-foreground hover:text-foreground/80 transition-colors">
                Start your free trial →
              </Link>
            </p>
          </div>

          {/* OAuth Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-muted/50 px-3 py-2.5 text-sm font-semibold text-foreground ring-1 ring-inset ring-border/50 hover:bg-muted focus-visible:ring-transparent transition-all hover-lift">
              <Github className="h-4 w-4" />
              GitHub
            </button>
            <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-muted/50 px-3 py-2.5 text-sm font-semibold text-foreground ring-1 ring-inset ring-border/50 hover:bg-muted focus-visible:ring-transparent transition-all hover-lift">
              {/* Google G icon */}
              <svg className="h-4 w-4" viewBox="0 0 48 48">
                <path fill="#4285F4" d="M44.5 20H24v8.5h11.9C34.5 33.1 30.1 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 2.9l6-6C34.5 6.5 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.3-4z"/>
                <path fill="#34A853" d="M6.3 14.7l7 5.1C15 16.1 19.1 13 24 13c3.1 0 5.8 1.1 7.9 2.9l6-6C34.5 6.5 29.6 4 24 4 16.3 4 9.6 8.4 6.3 14.7z"/>
                <path fill="#FBBC05" d="M24 44c5.9 0 10.9-1.9 14.5-5.2l-6.7-5.5C29.8 35.1 27.1 36 24 36c-6.1 0-11.2-4.1-12.9-9.6l-7 5.4C7.7 39.3 15.3 44 24 44z"/>
                <path fill="#EA4335" d="M44.5 20H24v8.5h11.9c-.8 2.3-2.3 4.3-4.4 5.8l6.7 5.5c3.9-3.6 6.3-8.9 6.3-15.4 0-1.3-.1-2.7-.3-4z"/>
              </svg>
              Google
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/50" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-background px-3 text-muted-foreground rounded-full">or continue with email</span>
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold leading-6 text-foreground mb-1.5">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="name@company.com"
                className="block w-full rounded-xl border-0 py-3 px-4 text-foreground shadow-sm ring-1 ring-inset ring-border/50 bg-muted/30 placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-foreground text-sm transition-all"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-sm font-semibold leading-6 text-foreground">
                  Password
                </label>
                <a href="#" className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors">
                  Forgot password?
                </a>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="••••••••"
                className="block w-full rounded-xl border-0 py-3 px-4 text-foreground shadow-sm ring-1 ring-inset ring-border/50 bg-muted/30 placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-foreground text-sm transition-all"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="group relative flex w-full justify-center rounded-xl bg-foreground px-4 py-3 text-sm font-bold leading-6 text-background shadow-md hover:bg-foreground/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground transition-all active:scale-[0.98] overflow-hidden disabled:opacity-70"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {isLoading ? (
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <>
                      Sign in
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </span>
                <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[150%] skew-x-[-20deg] group-hover:animate-[shimmer_1.5s_infinite]"></div>
              </button>
            </div>
          </form>

          <p className="text-center text-xs text-muted-foreground">
            Protected by enterprise-grade encryption.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
