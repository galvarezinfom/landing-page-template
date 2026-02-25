import { Pricing } from '@/components/sections/Pricing';
import { FAQ } from '@/components/sections/FAQ';
import { CTA } from '@/components/sections/CTA';

export const metadata = {
  title: 'Pricing - Enterprise UI',
  description: 'Simple, transparent pricing for your enterprise software.',
};

export default function PricingPage() {
  return (
    <div className="pt-8">
      <Pricing />
      <FAQ />
      <CTA />
    </div>
  );
}
