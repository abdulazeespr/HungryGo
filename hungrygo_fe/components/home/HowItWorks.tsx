'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface StepProps {
  number: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const Step = ({ number, title, description, icon }: StepProps) => {
  return (
    <div className="step-card relative flex flex-col items-center text-center px-4 py-6">
      <div className="step-number absolute -top-6 w-12 h-12 rounded-full bg-primary flex items-center justify-center text-foreground font-bold text-xl">
        {number}
      </div>
      <div className="step-icon text-primary-alt mt-8 mb-4 w-20 h-20 flex items-center justify-center rounded-full bg-secondary/50">
        {icon}
      </div>
      <h3 className="step-title text-xl font-semibold mb-3">{title}</h3>
      <p className="step-description text-foreground/70">{description}</p>
    </div>
  );
};

const HowItWorks = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);

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

    // Animate step numbers
    gsap.fromTo(
      '.step-number',
      { scale: 0, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        stagger: 0.3,
        duration: 0.6,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: stepsRef.current,
          start: 'top 70%',
        },
      }
    );

    // Animate step icons
    gsap.fromTo(
      '.step-icon',
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.3,
        duration: 0.6,
        delay: 0.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: stepsRef.current,
          start: 'top 70%',
        },
      }
    );

    // Animate step titles
    gsap.fromTo(
      '.step-title',
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.3,
        duration: 0.5,
        delay: 0.4,
        scrollTrigger: {
          trigger: stepsRef.current,
          start: 'top 70%',
        },
      }
    );

    // Animate step descriptions
    gsap.fromTo(
      '.step-description',
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.3,
        duration: 0.5,
        delay: 0.6,
        scrollTrigger: {
          trigger: stepsRef.current,
          start: 'top 70%',
        },
      }
    );

    // Animate the connecting line
    gsap.fromTo(
      '.connecting-line',
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 1.2,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: stepsRef.current,
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
          className="text-3xl md:text-4xl font-bold text-center mb-20"
        >
          How <span className="text-primary-alt">HungryGo</span> Works
        </h2>

        <div 
          ref={stepsRef}
          className="relative grid grid-cols-1 md:grid-cols-3 gap-8 mt-12"
        >
          {/* Connecting line (visible on md screens and up) */}
          <div className="connecting-line absolute top-16 left-[16.67%] right-[16.67%] h-1 bg-primary-alt/30 hidden md:block" style={{ transformOrigin: 'left' }}></div>

          <Step
            number={1}
            title="Choose Your Plan"
            description="Select from our variety of meal plans based on your preferences and dietary needs."
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-10 h-10">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />

          <Step
            number={2}
            title="Customize Your Meals"
            description="Personalize your weekly menu from our chef-crafted selection of delicious meals."
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-10 h-10">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            }
          />

          <Step
            number={3}
            title="Enjoy Fresh Delivery"
            description="Receive your freshly prepared meals right at your doorstep on your scheduled delivery days."
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-10 h-10">
                <path d="M12 14l9-5-9-5-9 5 9 5z" />
                <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
              </svg>
            }
          />
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;