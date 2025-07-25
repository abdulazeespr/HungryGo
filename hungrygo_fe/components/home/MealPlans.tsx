'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface PlanFeature {
  included: boolean;
  text: string;
}

interface PlanProps {
  name: string;
  price: string;
  period: string;
  description: string;
  features: PlanFeature[];
  popular?: boolean;
}

const plans: PlanProps[] = [
  {
    name: 'Basic',
    price: '$89',
    period: 'per week',
    description: 'Perfect for individuals looking for convenient, healthy meals.',
    features: [
      { included: true, text: '5 meals per week' },
      { included: true, text: 'Standard menu selection' },
      { included: true, text: 'Weekly delivery' },
      { included: false, text: 'Customizable meals' },
      { included: false, text: 'Premium menu access' },
    ],
  },
  {
    name: 'Premium',
    price: '$129',
    period: 'per week',
    description: 'Our most popular plan with the perfect balance of value and variety.',
    features: [
      { included: true, text: '7 meals per week' },
      { included: true, text: 'Full menu selection' },
      { included: true, text: 'Bi-weekly delivery' },
      { included: true, text: 'Customizable meals' },
      { included: false, text: 'Premium menu access' },
    ],
    popular: true,
  },
  {
    name: 'Family',
    price: '$199',
    period: 'per week',
    description: 'Designed for families with a variety of tastes and dietary needs.',
    features: [
      { included: true, text: '10 meals per week' },
      { included: true, text: 'Full menu selection' },
      { included: true, text: 'Flexible delivery schedule' },
      { included: true, text: 'Customizable meals' },
      { included: true, text: 'Premium menu access' },
    ],
  },
];

const PlanCard = ({ name, price, period, description, features, popular }: PlanProps) => {
  return (
    <div className={`plan-card relative rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:transform hover:-translate-y-2 ${popular ? 'border-2 border-primary-alt' : 'border border-gray-200'}`}>
      {popular && (
        <div className="absolute top-0 right-0 bg-primary-alt text-white px-4 py-1 rounded-bl-lg font-medium text-sm">
          Most Popular
        </div>
      )}
      <div className={`p-6 ${popular ? 'bg-primary-alt/10' : 'bg-white'}`}>
        <h3 className="plan-name text-2xl font-bold mb-2">{name}</h3>
        <div className="plan-price flex items-end mb-4">
          <span className="text-4xl font-bold">{price}</span>
          <span className="text-foreground/60 ml-1">{period}</span>
        </div>
        <p className="plan-description text-foreground/70 mb-6">{description}</p>
        <ul className="plan-features space-y-3 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <span className={`mr-2 mt-1 ${feature.included ? 'text-green-500' : 'text-red-500'}`}>
                {feature.included ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
              </span>
              <span className={feature.included ? 'text-foreground' : 'text-foreground/50 line-through'}>
                {feature.text}
              </span>
            </li>
          ))}
        </ul>
        <button className={`plan-cta w-full py-3 rounded-lg font-medium transition-colors duration-300 ${popular ? 'bg-primary-alt text-white hover:bg-primary' : 'bg-secondary hover:bg-secondary-alt text-foreground'}`}>
          Choose Plan
        </button>
      </div>
    </div>
  );
};

const MealPlans = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const plansRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Animate section title
    gsap.fromTo(
      titleRef.current,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        scrollTrigger: {
          trigger: titleRef.current,
          start: 'top 80%',
        },
      }
    );

    // Animate section subtitle
    gsap.fromTo(
      subtitleRef.current,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        delay: 0.2,
        scrollTrigger: {
          trigger: titleRef.current,
          start: 'top 80%',
        },
      }
    );

    // Animate plan cards
    gsap.fromTo(
      '.plan-card',
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.2,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: plansRef.current,
          start: 'top 70%',
        },
      }
    );

    // Animate plan names
    gsap.fromTo(
      '.plan-name',
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.2,
        duration: 0.5,
        delay: 0.3,
        scrollTrigger: {
          trigger: plansRef.current,
          start: 'top 70%',
        },
      }
    );

    // Animate plan prices
    gsap.fromTo(
      '.plan-price',
      { scale: 0.8, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        stagger: 0.2,
        duration: 0.5,
        delay: 0.4,
        ease: 'back.out(1.2)',
        scrollTrigger: {
          trigger: plansRef.current,
          start: 'top 70%',
        },
      }
    );

    // Animate plan descriptions
    gsap.fromTo(
      '.plan-description',
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.2,
        duration: 0.5,
        delay: 0.5,
        scrollTrigger: {
          trigger: plansRef.current,
          start: 'top 70%',
        },
      }
    );

    // Animate plan features
    gsap.fromTo(
      '.plan-features li',
      { x: -20, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        stagger: 0.05,
        duration: 0.4,
        delay: 0.6,
        scrollTrigger: {
          trigger: plansRef.current,
          start: 'top 70%',
        },
      }
    );

    // Animate CTA buttons
    gsap.fromTo(
      '.plan-cta',
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.2,
        duration: 0.5,
        delay: 0.8,
        scrollTrigger: {
          trigger: plansRef.current,
          start: 'top 70%',
        },
      }
    );
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 
          ref={titleRef}
          className="text-3xl md:text-4xl font-bold text-center mb-4"
        >
          Choose Your <span className="text-primary-alt">Meal Plan</span>
        </h2>
        <p 
          ref={subtitleRef}
          className="text-center text-foreground/70 max-w-2xl mx-auto mb-16"
        >
          Select the perfect meal plan that fits your lifestyle and dietary preferences. All plans include fresh, chef-prepared meals delivered right to your door.
        </p>

        <div 
          ref={plansRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {plans.map((plan, index) => (
            <PlanCard key={index} {...plan} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MealPlans;