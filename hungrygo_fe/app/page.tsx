import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import HowItWorks from '@/components/home/HowItWorks';
import MealPlans from '@/components/home/MealPlans';
import Testimonials from '@/components/home/Testimonials';
import FAQ from '@/components/home/FAQ';
import CallToAction from '@/components/home/CallToAction';
import IconExample from '@/components/ui/IconExample';

export default function Home() {
  return (
    <main>
      <Hero />
      <div className="container mx-auto my-8">
        <IconExample />
      </div>
      <Features />
      <HowItWorks />
      <MealPlans />
      <Testimonials />
      <FAQ />
      <CallToAction />
    </main>
  );
}