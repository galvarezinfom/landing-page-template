import { FAQ as FAQSection } from '@/components/sections/FAQ';
import { CTA } from '@/components/sections/CTA';

export const metadata = {
  title: 'FAQ - Enterprise UI',
  description: 'Frequently asked questions about our UI platform.',
};

export default function FAQPage() {
  return (
    <div className="pt-8">
      <FAQSection />
      <CTA />
    </div>
  );
}
