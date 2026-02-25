'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Activity, ShieldCheck, Database, Zap } from 'lucide-react';
import Link from 'next/link';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background pt-32 pb-32 lg:pt-40 flex flex-col items-center justify-center min-h-[95vh] selection:bg-foreground selection:text-background">
      {/* Premium Background Elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      <div className="absolute left-1/2 top-0 -z-10 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-foreground/10 to-transparent blur-[80px] rounded-full pointer-events-none"></div>
      
      <div className="container relative z-10 px-4 md:px-6 mx-auto flex flex-col items-center text-center space-y-10">
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.8, ease: "easeOut" }}
           className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-background/50 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground backdrop-blur-md shadow-sm"
        >
          <Sparkles className="h-3 w-3 text-foreground" />
          <span>Nexus Data Platform v3.0</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="max-w-5xl text-5xl font-extrabold tracking-tighter sm:text-7xl md:text-8xl text-gradient pb-2"
        >
          Unleash the Power <br className="hidden md:block" /> of Predictive AI.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="max-w-2xl text-lg text-muted-foreground sm:text-xl leading-relaxed mx-auto font-medium"
        >
          Transform raw data into actionable insights in milliseconds. Nexus connects your entire infrastructure to our advanced neural networks securely.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4"
        >
          <Link
            href="/start"
            className="group relative inline-flex h-12 sm:h-14 items-center justify-center rounded-full bg-foreground px-8 text-sm sm:text-base font-semibold text-background shadow-lg transition-all hover:bg-foreground/90 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 overflow-hidden"
          >
            <span className="relative z-10 flex items-center">
               Start Free Trial
               <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
            <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] skew-x-[-20deg] group-hover:animate-[shimmer_1.5s_infinite]"></div>
          </Link>
          <Link
            href="#demo"
            className="inline-flex h-12 sm:h-14 items-center justify-center rounded-full border border-border/60 bg-background/50 backdrop-blur-md px-8 text-sm sm:text-base font-medium shadow-sm transition-all hover:bg-accent hover:text-accent-foreground hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Book a Demo
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="mt-16 sm:mt-24 w-full max-w-5xl relative z-20 group perspective-[2000px]"
        >
          <div className="absolute -inset-1 bg-gradient-to-b from-foreground/20 to-transparent rounded-2xl blur-lg opacity-50 group-hover:opacity-100 transition duration-1000"></div>
          
          <div className="relative glass-panel rounded-2xl p-2 sm:p-4 rotate-x-[2deg] group-hover:rotate-x-0 transition-transform duration-700 ease-out shadow-2xl overflow-hidden border-t-white/20 dark:border-t-white/10">
            {/* Mock Dashboard UI */}
            <div className="rounded-xl border border-border/40 bg-card overflow-hidden h-[300px] sm:h-[450px] lg:h-[600px] flex flex-col shadow-inner">
               <div className="h-10 border-b border-border/40 bg-muted/40 flex items-center px-4 gap-2">
                 <div className="flex gap-1.5">
                   <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                   <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                   <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                 </div>
                 <div className="mx-auto w-48 h-5 rounded-md bg-background/80 border border-border/50 text-[10px] text-muted-foreground flex items-center justify-center font-mono">
                   nexus.analytical.app
                 </div>
               </div>
               
               <div className="flex-1 flex p-2 sm:p-4 gap-4 bg-muted/10">
                  <div className="hidden sm:flex flex-col w-48 gap-2">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className="h-8 rounded flex items-center px-3 gap-3 bg-card border border-border/30">
                         <div className="w-4 h-4 rounded-full bg-muted-foreground/20"></div>
                         <div className="h-2 w-16 bg-muted-foreground/20 rounded"></div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 auto-rows-min">
                     {/* BENTO CARDS */}
                     <div className="col-span-1 border-border/40 bg-card p-4 h-32 flex flex-col justify-between hover:border-foreground/20 transition-colors rounded-2xl relative overflow-hidden group hover-lift border">
                        <div className="flex items-center gap-2"><Activity className="w-4 h-4 text-foreground/60"/> <span className="text-xs font-semibold">Inferences / sec</span></div>
                        <div className="text-3xl font-bold tracking-tighter text-foreground">1,245.9</div>
                     </div>
                     <div className="col-span-1 border border-border/40 bg-card p-4 shadow-sm h-32 flex flex-col justify-between hover:border-foreground/20 transition-colors rounded-2xl relative overflow-hidden group hover-lift">
                        <div className="flex items-center gap-2"><Database className="w-4 h-4 text-foreground/60"/> <span className="text-xs font-semibold">Data Streams</span></div>
                        <div className="text-3xl font-bold tracking-tighter text-foreground">14 Active</div>
                     </div>
                     <div className="col-span-1 sm:col-span-2 border border-border/40 bg-card p-4 shadow-sm h-48 sm:h-auto flex flex-col hover:border-foreground/20 transition-colors relative overflow-hidden rounded-2xl group hover-lift">
                        <div className="flex items-center gap-2 mb-4"><Zap className="w-4 h-4 text-foreground/60"/> <span className="text-xs font-semibold">Model Accuracy Pulse</span></div>
                        {/* Mock Graph Lines */}
                        <div className="flex-1 border-b border-l border-border/40 relative">
                           <div className="absolute inset-0 bg-gradient-to-t from-foreground/5 to-transparent"></div>
                           <svg viewBox="0 0 100 100" className="w-[110%] h-[110%] absolute bottom-0 -left-2 stroke-foreground/40 stroke-2 fill-none preserveAspectRatio='none'">
                              <path d="M0,80 Q10,75 20,60 T40,40 T60,50 T80,20 T100,10"/>
                           </svg>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </motion.div>
      </div>

      <style jsx global>{`
        @keyframes shimmer {
          100% {
            transform: translateX(150%) skewX(-20deg);
          }
        }
      `}</style>
    </section>
  );
}
