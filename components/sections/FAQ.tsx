'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: "How does the AI model handle PII and sensitive data?",
    answer: "Nexus Engine encrypts all data at rest and in transit. Machine learning inferences are performed in an isolated neural mesh, ensuring PII is anonymized prior to ingestion. We are fully SOC-2 and HIPAA compliant."
  },
  {
    question: "Do I need dedicated data scientists to use Nexus?",
    answer: "Not necessarily. While we offer deep customization for advanced data teams, our auto-ML features and pre-trained models allow developers to deploy predictive pipelines in minutes using standard APIs."
  },
  {
    question: "What is the expected latency for real-time streams?",
    answer: "Thanks to our distributed edge architecture, the average P99 latency is under 40 milliseconds for standard queries, regardless of where your servers are located globally."
  },
  {
    question: "Can I deploy the engine on premise?",
    answer: "Yes, our Enterprise plan supports completely air-gapped on-premise deployments or VPC installations via Docker and Kubernetes orchestrated containers."
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 md:py-32 bg-background relative overflow-hidden">
      <div className="absolute left-0 bottom-0 w-[600px] h-[600px] bg-foreground/5 blur-[150px] rounded-full pointer-events-none -z-10 translate-y-1/2 -translate-x-1/2"></div>
      
      <div className="container mx-auto px-4 sm:px-8 max-w-4xl relative z-10">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-foreground/60 font-medium tracking-widest text-xs uppercase">Knowledge Base</h2>
          <h3 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-gradient">
            Frequently Asked Questions
          </h3>
          <p className="mt-4 text-lg text-muted-foreground">
            Everything you need to know about integrating and scaling the platform.
          </p>
        </div>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="glass-panel border-border/40 rounded-xl overflow-hidden transition-all duration-300"
            >
              <button
                className="w-full flex justify-between items-center p-6 text-left focus:outline-none hover:bg-muted/10 transition-colors"
                onClick={() => toggle(index)}
              >
                <span className="font-semibold text-foreground">{faq.question}</span>
                <ChevronDown 
                  className={`h-5 w-5 text-muted-foreground transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`} 
                />
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-6 pb-6 text-muted-foreground text-sm border-t border-border/20 pt-4 leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
