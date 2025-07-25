import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import HowItWorks from '@/components/home/HowItWorks';
import MealPlans from '@/components/home/MealPlans';
import Testimonials from '@/components/home/Testimonials';
import FAQ from '@/components/home/FAQ';
import CallToAction from '@/components/home/CallToAction';

export default function Home() {
  return (
    <main>
      <Hero />
      <Features />
      <HowItWorks />
      <MealPlans />
      <Testimonials />
      <FAQ />
      <CallToAction />
    </main>
  );
}