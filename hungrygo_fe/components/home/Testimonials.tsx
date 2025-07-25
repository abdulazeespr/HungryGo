'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface TestimonialProps {
  quote: string;
  author: string;
  role: string;
  image: string;
  rating: number;
}

const testimonials: TestimonialProps[] = [
  {
    quote: "HungryGo has completely transformed my weeknight dinners. The meals are delicious, and I love how easy it is to customize my plan based on my dietary preferences.",
    author: "Sarah Johnson",
    role: "Busy Professional",
    image: "/images/testimonial-1.svg", // Placeholder SVG
    rating: 5
  },
  {
    quote: "As a fitness enthusiast, I need meals that are both nutritious and tasty. HungryGo delivers on both fronts, and the flexible scheduling is perfect for my changing routine.",
    author: "Michael Chen",
    role: "Fitness Trainer",
    image: "/images/testimonial-2.svg", // Placeholder SVG
    rating: 5
  },
  {
    quote: "My family loves the variety of meals we get from HungryGo. It's saved us so much time on meal planning and grocery shopping, and the kids actually look forward to dinner now!",
    author: "Jessica Rivera",
    role: "Parent of Three",
    image: "/images/testimonial-3.svg", // Placeholder SVG
    rating: 4
  },
];

const TestimonialCard = ({ quote, author, role, image, rating }: TestimonialProps) => {
  return (
    <div className="testimonial-card bg-white p-6 rounded-xl shadow-md flex flex-col h-full">
      <div className="testimonial-stars flex mb-4">
        {[...Array(5)].map((_, i) => (
          <svg 
            key={i}
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill={i < rating ? "currentColor" : "none"}
            stroke="currentColor"
            className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={i < rating ? 0 : 1} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        ))}
      </div>
      <div className="testimonial-quote flex-grow mb-6 italic text-foreground/80">
        "{quote}"
      </div>
      <div className="testimonial-author flex items-center">
        <div className="testimonial-image w-12 h-12 rounded-full bg-secondary/50 flex items-center justify-center mr-4">
          {/* Placeholder for image - in a real app, you'd use an actual image */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-primary-alt">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div>
          <div className="testimonial-name font-semibold">{author}</div>
          <div className="testimonial-role text-sm text-foreground/60">{role}</div>
        </div>
      </div>
    </div>
  );
};

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

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

    // Animate testimonial cards
    gsap.fromTo(
      '.testimonial-card',
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.2,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: cardsRef.current,
          start: 'top 70%',
        },
      }
    );

    // Animate stars
    gsap.fromTo(
      '.testimonial-stars svg',
      { scale: 0, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        stagger: 0.1,
        duration: 0.4,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: cardsRef.current,
          start: 'top 70%',
        },
      }
    );

    // Animate quotes
    gsap.fromTo(
      '.testimonial-quote',
      { opacity: 0 },
      {
        opacity: 1,
        stagger: 0.2,
        duration: 0.8,
        delay: 0.3,
        scrollTrigger: {
          trigger: cardsRef.current,
          start: 'top 70%',
        },
      }
    );

    // Animate author info
    gsap.fromTo(
      '.testimonial-author',
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.2,
        duration: 0.5,
        delay: 0.5,
        scrollTrigger: {
          trigger: cardsRef.current,
          start: 'top 70%',
        },
      }
    );
  }, []);

  // Auto-rotate testimonials on mobile
  useEffect(() => {
    const interval = setInterval(() => {
      if (window.innerWidth < 768) { // Only auto-rotate on mobile
        setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-secondary/20">
      <div className="container mx-auto px-4">
        <h2 
          ref={titleRef}
          className="text-3xl md:text-4xl font-bold text-center mb-16"
        >
          What Our <span className="text-primary-alt">Customers</span> Say
        </h2>

        {/* Mobile Testimonials (Carousel) */}
        <div className="md:hidden">
          <div className="testimonial-card-container relative overflow-hidden h-[400px]">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className={`absolute w-full transition-all duration-500 ${index === activeIndex ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}`}
              >
                <TestimonialCard {...testimonial} />
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-3 h-3 rounded-full ${index === activeIndex ? 'bg-primary-alt' : 'bg-gray-300'}`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Desktop Testimonials (Grid) */}
        <div 
          ref={cardsRef}
          className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;