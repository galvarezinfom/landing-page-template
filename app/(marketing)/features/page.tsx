import { Features } from '@/components/sections/Features';
import { CTA } from '@/components/sections/CTA';

export const metadata = {
  title: 'Features - Enterprise UI',
  description: 'Explore the modern capabilities of our enterprise landing page platform.',
};

export default function FeaturesPage() {
  return (
    <div className="pt-8">
      <Features />
      <CTA />
    </div>
  );
}
