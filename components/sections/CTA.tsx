import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function CTA() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden bg-background">
      <div className="container mx-auto px-4 sm:px-8">
        <div className="relative rounded-3xl overflow-hidden glass-panel border border-border/50 p-12 sm:p-20 text-center isolate">
          {/* Inner Glow Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/5 to-transparent -z-10"></div>
          <div className="absolute left-1/2 -top-24 -translate-x-1/2 w-[80%] h-[200px] bg-foreground/10 blur-[80px] rounded-full pointer-events-none -z-10"></div>
          
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl font-extrabold tracking-tighter sm:text-5xl lg:text-6xl text-foreground text-balance">
              Ready to construct <br className="hidden sm:block" /> your empire?
            </h2>
            <p className="text-xl leading-relaxed text-muted-foreground max-w-2xl mx-auto font-medium">
              Join thousands of leading innovators using our robust platform to dominate their markets. Deploy instantly, scale infinitely.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/signup"
                className="group relative inline-flex h-14 items-center justify-center rounded-full bg-foreground px-8 text-base font-semibold text-background shadow-lg transition-all hover:bg-foreground/90 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring overflow-hidden w-full sm:w-auto"
              >
                <span className="relative z-10 flex items-center">
                  Start Building Today
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1.5" />
                </span>
                <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] skew-x-[-20deg] group-hover:animate-[shimmer_1.5s_infinite]"></div>
              </Link>
              <Link 
                href="/contact" 
                className="w-full sm:w-auto inline-flex h-14 items-center justify-center text-sm font-semibold text-foreground hover:text-foreground/80 hover:bg-muted/50 rounded-full px-8 transition-colors"
              >
                Talk to Sales
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
