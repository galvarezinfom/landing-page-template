'use client';

import { motion } from 'framer-motion';

const testimonials = [
  {
    content: "This template saved us weeks of development time. It's clean, modern, and exactly what we needed to launch our MVP.",
    author: "Jane Doe",
    role: "CTO, StartupX",
    company: "StartupX"
  },
  {
    content: "The customization options are incredible. We adapted it to our brand in less than a day. Highly recommended for any serious business.",
    author: "John Smith",
    role: "Lead Developer",
    company: "InnovateTech"
  },
  {
    content: "Performance is top-notch. Our Lighthouse scores are 100s across the board, which really helped our SEO efforts.",
    author: "Alice Johnson",
    role: "Marketing Director",
    company: "Growth Co."
  }
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-24 md:py-32 bg-background relative overflow-hidden">
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-foreground/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      
      <div className="container mx-auto px-4 sm:px-8 relative z-10">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-foreground/60 font-medium tracking-widest text-xs uppercase">Hall of Fame</h2>
          <h3 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-gradient">
            Trusted by Forward-Thinking Teams
          </h3>
          <p className="mt-4 text-lg text-muted-foreground">
            Don't just take our word for it. Here's what our users say.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.5 }}
              className="glass-panel p-8 relative isolate flex flex-col hover-lift border-border/40 rounded-2xl group"
            >
              <div className="absolute inset-x-0 -top-px h-px w-full bg-gradient-to-r from-transparent via-foreground/10 to-transparent transform opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="mb-6 flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-4 h-4 text-foreground/80 dark:text-foreground/60" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                ))}
              </div>
              
              <p className="text-foreground relative z-10 font-medium leading-relaxed mb-8 flex-auto">
                "{testimonial.content}"
              </p>
              
              <div className="flex items-center gap-4 mt-auto">
                <div className="w-10 h-10 rounded-full bg-muted/80 flex items-center justify-center font-bold text-sm text-foreground ring-1 ring-border/50">
                   {testimonial.author.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">{testimonial.author}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.role} @ {testimonial.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
