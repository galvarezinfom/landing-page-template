import { Testimonials } from '@/components/sections/Testimonials';
import { CTA } from '@/components/sections/CTA';

export const metadata = {
  title: 'Testimonials - Enterprise UI',
  description: 'See what our customers have to say about Enterprise UI.',
};

export default function TestimonialsPage() {
  return (
    <div className="pt-8">
      <Testimonials />
      <CTA />
    </div>
  );
}
