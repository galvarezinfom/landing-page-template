'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: "Do you offer technical support?",
    answer: "Yes, we offer priority email support for all pro plans, and 24/7 phone support for our enterprise users. Our community forum is also available 24/7."
  },
  {
    question: "Can I use this for multiple clients?",
    answer: "Absolutely! The standard license allows you to use the template for a single end product, while our developer license lets you use it for unlimited client projects."
  },
  {
    question: "Is it easy to customize the theme?",
    answer: "Very easy. We use standard CSS variables and Tailwind classes. By updating just a few variables in the global CSS, you can completely change the look and feel."
  },
  {
    question: "Do you have a refund policy?",
    answer: "Yes, we offer a 14-day no-questions-asked money-back guarantee if you find the template isn't the right fit for your needs."
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-8 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Everything you need to know about the product and billing.
          </p>
        </div>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="border border-border bg-background rounded-lg overflow-hidden transition-all duration-200"
            >
              <button
                className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
                onClick={() => toggle(index)}
              >
                <span className="font-medium text-foreground">{faq.question}</span>
                <ChevronDown 
                  className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${
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
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-6 pb-6 text-muted-foreground text-sm border-t border-border/50 pt-4">
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
