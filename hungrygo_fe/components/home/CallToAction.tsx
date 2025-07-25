'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const CallToAction = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Create a timeline for the CTA section animations
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 70%',
      },
    });

    // Add animations to the timeline
    tl.fromTo(
      contentRef.current,
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out' }
    )
      .fromTo(
        titleRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
        '-=0.4'
      )
      .fromTo(
        textRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
        '-=0.4'
      )
      .fromTo(
        ctaRef.current?.children,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.2, duration: 0.5, ease: 'power2.out' },
        '-=0.2'
      );

    // Create a hover effect for the CTA buttons
    const ctaButtons = ctaRef.current?.querySelectorAll('button');
    ctaButtons?.forEach((button) => {
      button.addEventListener('mouseenter', () => {
        gsap.to(button, { scale: 1.05, duration: 0.3, ease: 'power2.out' });
      });
      button.addEventListener('mouseleave', () => {
        gsap.to(button, { scale: 1, duration: 0.3, ease: 'power2.out' });
      });
    });

    // Cleanup function
    return () => {
      ctaButtons?.forEach((button) => {
        button.removeEventListener('mouseenter', () => {});
        button.removeEventListener('mouseleave', () => {});
      });
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="py-20 bg-gradient-to-r from-primary to-primary-alt text-white"
    >
      <div className="container mx-auto px-4">
        <div 
          ref={contentRef}
          className="max-w-4xl mx-auto text-center bg-white/10 backdrop-blur-sm rounded-xl p-10 shadow-lg"
        >
          <h2 
            ref={titleRef}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            Ready to Simplify Your Meal Planning?
          </h2>
          <p 
            ref={textRef}
            className="text-lg mb-8 text-white/90 max-w-2xl mx-auto"
          >
            Join thousands of satisfied customers who enjoy delicious, chef-prepared meals delivered right to their doorstep. Sign up today and get your first week at 20% off!
          </p>
          <div 
            ref={ctaRef}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <button className="bg-white text-primary font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
              Get Started
            </button>
            <button className="bg-transparent border-2 border-white text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
              View Meal Plans
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;