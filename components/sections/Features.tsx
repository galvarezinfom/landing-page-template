'use client';

import { motion } from 'framer-motion';
import { Layers, Zap, Shield, Infinity, Code, Smartphone } from 'lucide-react';

const features = [
  {
    icon: <Zap className="h-6 w-6 text-primary" />,
    title: 'Lightning Fast',
    description: 'Optimized for speed and performance, powered by Next.js App Router and React Server Components.',
  },
  {
    icon: <Shield className="h-6 w-6 text-primary" />,
    title: 'Enterprise Security',
    description: 'Built-in security best practices, ready for compliance and rigid data protection standards.',
  },
  {
    icon: <Layers className="h-6 w-6 text-primary" />,
    title: 'Highly Modular',
    description: 'Change anything. Component-based architecture allows complete customization for each client.',
  },
  {
    icon: <Smartphone className="h-6 w-6 text-primary" />,
    title: 'Fully Responsive',
    description: 'Looks perfect on every device out of the box. Fluid typography and responsive layout.',
  },
  {
    icon: <Code className="h-6 w-6 text-primary" />,
    title: 'Developer Friendly',
    description: 'Clean code, TypeScript autocomplete, and extensive comments make it a joy to work with.',
  },
  {
    icon: <Infinity className="h-6 w-6 text-primary" />,
    title: 'Infinite Scalability',
    description: 'From day 1 to day 1000, the architecture is designed to grow with your business needs.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function Features() {
  return (
    <section id="features" className="bg-background relative py-24 md:py-32 overflow-hidden">
      {/* Decorative gradient spot */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-foreground/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      
      <div className="container mx-auto px-4 sm:px-8">
        <div className="mx-auto max-w-2xl lg:text-center space-y-4">
          <h2 className="text-foreground/60 font-medium tracking-widest text-xs uppercase">Core Capabilities</h2>
          <p className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl text-gradient text-balance">
            Everything you need to ship world-class software
          </p>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            We handled the complex infrastructure entirely so you can focus on what matters: delivering value to your users quickly and securely.
          </p>
        </div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none"
        >
          <dl className="grid max-w-xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3">
            {features.map((feature, idx) => (
              <motion.div key={idx} variants={itemVariants} className="flex flex-col glass-panel p-8 rounded-2xl relative overflow-hidden group hover-lift border-border/40">
                <div className="absolute inset-x-0 -top-px h-px w-full bg-gradient-to-r from-transparent via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <dt className="flex items-center gap-x-4 text-base font-semibold leading-7 text-foreground">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-foreground text-background shadow-inner">
                    {feature.icon}
                  </div>
                  {feature.title}
                </dt>
                <dd className="mt-5 flex flex-auto flex-col text-base leading-relaxed text-muted-foreground">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </motion.div>
            ))}
          </dl>
        </motion.div>
      </div>
    </section>
  );
}
