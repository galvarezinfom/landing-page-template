'use client';

import { CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const plans = [
  {
    name: "Starter",
    price: "Free",
    description: "Perfect for exploring the features and small personal projects.",
    features: [
      "1 User",
      "Core Features",
      "Community Support",
      "Basic Analytics"
    ],
    cta: "Start for free",
    popular: false
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    description: "Ideal for growing teams needing advanced functionality.",
    features: [
      "Up to 5 Users",
      "All Pro Features",
      "Priority Email Support",
      "Advanced Analytics",
      "Custom Domains"
    ],
    cta: "Get Pro Tracker",
    popular: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large scale organizations requiring maximum control.",
    features: [
      "Unlimited Users",
      "Everything in Pro",
      "24/7 Phone Support",
      "SSO & Security",
      "Dedicated Account Manager"
    ],
    cta: "Contact Sales",
    popular: false
  }
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24 md:py-32 bg-background relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-foreground/5 blur-[100px] pointer-events-none -z-10 absolute-center"></div>
      
      <div className="container mx-auto px-4 sm:px-8 relative z-10">
        <div className="mx-auto max-w-2xl text-center mb-16 space-y-4">
          <h2 className="text-foreground/60 font-medium tracking-widest text-xs uppercase">Pricing Plans</h2>
          <h3 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-gradient">
            Simple, Transparent Pricing
          </h3>
          <p className="mt-4 text-lg text-muted-foreground">
            No hidden fees. Choose the best plan for your team and scale as you grow.
          </p>
        </div>
        
        <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.5 }}
              className={`relative flex flex-col rounded-3xl p-8 transition-all duration-300 ${
                plan.popular 
                ? 'glass-panel border-foreground/20 scale-105 z-10 shadow-2xl relative' 
                : 'glass-panel border-border/40 hover-lift'
              }`}
            >
              {plan.popular && (
                <>
                  <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-b from-foreground/30 to-transparent -z-10 pointer-events-none"></div>
                  <div className="absolute -top-4 left-0 right-0 mx-auto w-fit rounded-full bg-foreground px-4 py-1 text-xs font-bold text-background uppercase tracking-widest shadow-md">
                    Most Popular
                  </div>
                </>
              )}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
              </div>
              
              <div className="mt-2 mb-8 flex items-baseline gap-x-2">
                <span className={`text-5xl font-extrabold tracking-tight ${plan.popular ? 'text-foreground' : 'text-foreground/80'}`}>{plan.price}</span>
                {plan.period && <span className="text-sm font-medium text-muted-foreground">{plan.period}</span>}
              </div>
              
              <ul className="mb-8 flex-1 space-y-4 text-sm leading-6 text-muted-foreground">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex gap-x-3 text-foreground/90 font-medium items-center">
                    <CheckCircle2 className={`h-5 w-5 flex-none ${plan.popular ? 'text-foreground' : 'text-foreground/50'}`} />
                    {feature}
                  </li>
                ))}
              </ul>
              
              <button
                className={`mt-auto block w-full rounded-xl px-3 py-3.5 text-center text-sm font-bold shadow-sm transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 hover:scale-[1.02] active:scale-[0.98] ${
                  plan.popular 
                  ? 'bg-foreground text-background hover:bg-foreground/90 ring-1 ring-inset ring-foreground/20' 
                  : 'bg-muted/50 text-foreground ring-1 ring-inset ring-border/50 hover:bg-muted'
                }`}
              >
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
