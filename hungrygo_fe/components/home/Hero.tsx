'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create a timeline for coordinated animations
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Animate headline with text reveal
    tl.fromTo(
      headlineRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 }
    );

    // Animate subheadline
    tl.fromTo(
      subheadlineRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6 },
      '-=0.4' // Start slightly before previous animation finishes
    );

    // Animate CTA buttons
    tl.fromTo(
      ctaRef.current?.children,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.2, duration: 0.6 },
      '-=0.3'
    );

    // Animate food image with staggered reveal
    tl.fromTo(
      imageRef.current,
      { scale: 0.9, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.8 },
      '-=0.5'
    );

    // Parallax effect on scroll
    gsap.to(imageRef.current, {
      y: 100,
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
  }, []);

  return (
    <section 
      ref={heroRef}
      className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-b from-secondary/20 to-background"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] bg-repeat bg-center opacity-30"></div>
      </div>

      <div className="container mx-auto px-4 z-10 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 
              ref={headlineRef}
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
            >
              Delicious Meals <span className="text-primary">Delivered</span> To Your Door
            </h1>
            <p 
              ref={subheadlineRef}
              className="text-xl text-foreground/80 mb-8 max-w-lg"
            >
              Fresh, healthy, and chef-prepared meals customized to your preferences and delivered on your schedule.
            </p>
            <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/meal-plans" 
                className="btn btn-primary text-center px-8 py-3 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                Explore Meal Plans
              </Link>
              <Link 
                href="/how-it-works" 
                className="btn text-center px-8 py-3 rounded-lg font-semibold text-lg border-2 border-primary-alt text-primary-alt hover:bg-primary-alt hover:text-white transition-colors duration-300"
              >
                How It Works
              </Link>
            </div>
          </div>
          <div 
            ref={imageRef}
            className="relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl"
          >
            {/* This would be replaced with an actual image in production */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-alt to-primary opacity-90 flex items-center justify-center">
              <span className="text-white text-2xl font-bold">Food Image Placeholder</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-background to-transparent z-10"></div>
    </section>
  );
};

export default Hero;