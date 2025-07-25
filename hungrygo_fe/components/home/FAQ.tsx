'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  toggleOpen: () => void;
  index: number;
}

const faqs = [
  {
    question: 'How does HungryGo meal delivery work?',
    answer: 'HungryGo delivers chef-prepared meals to your doorstep based on your selected meal plan. You choose your preferred meals from our weekly menu, and we deliver them fresh on your scheduled delivery days. All meals come ready to heat and eat in minutes.'
  },
  {
    question: 'Can I customize my meal plan?',
    answer: 'Absolutely! You can customize your meal plan based on your dietary preferences, allergies, and taste preferences. Our flexible platform allows you to swap meals, skip weeks, or adjust your delivery schedule at any time.'
  },
  {
    question: 'How fresh are the meals?',
    answer: 'Our meals are prepared fresh by professional chefs using high-quality ingredients. They are never frozen and are delivered within 24 hours of preparation to ensure maximum freshness and flavor.'
  },
  {
    question: 'Do you accommodate dietary restrictions?',
    answer: 'Yes, we cater to various dietary needs including vegetarian, vegan, gluten-free, dairy-free, low-carb, and more. You can set your dietary preferences in your account, and our menu will filter accordingly.'
  },
  {
    question: 'How much does delivery cost?',
    answer: 'Delivery is free for all subscription plans. For one-time orders, a small delivery fee may apply depending on your location.'
  },
  {
    question: 'Can I skip or cancel my subscription?',
    answer: 'Yes, you can skip deliveries or cancel your subscription at any time with no penalties. Simply log into your account and manage your subscription settings at least 3 days before your next scheduled delivery.'
  },
];

const FAQItem = ({ question, answer, isOpen, toggleOpen, index }: FAQItemProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const questionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      if (isOpen) {
        gsap.to(contentRef.current, {
          height: 'auto',
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out',
        });
        gsap.to(questionRef.current?.querySelector('svg'), {
          rotation: 180,
          duration: 0.3,
          ease: 'power2.out',
        });
      } else {
        gsap.to(contentRef.current, {
          height: 0,
          opacity: 0,
          duration: 0.3,
          ease: 'power2.out',
        });
        gsap.to(questionRef.current?.querySelector('svg'), {
          rotation: 0,
          duration: 0.3,
          ease: 'power2.out',
        });
      }
    }
  }, [isOpen]);

  return (
    <div className="faq-item border-b border-gray-200 last:border-b-0">
      <div 
        ref={questionRef}
        className="faq-question flex justify-between items-center py-4 cursor-pointer"
        onClick={toggleOpen}
      >
        <h3 className="text-lg font-medium pr-8">{question}</h3>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5 text-primary-alt transition-transform duration-300" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      <div 
        ref={contentRef}
        className="faq-answer overflow-hidden opacity-0 h-0"
      >
        <p className="pb-4 text-foreground/70">{answer}</p>
      </div>
    </div>
  );
};

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const faqsRef = useRef<HTMLDivElement>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

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

    // Animate FAQ items
    gsap.fromTo(
      '.faq-item',
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: faqsRef.current,
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
          className="text-3xl md:text-4xl font-bold text-center mb-16"
        >
          Frequently Asked <span className="text-primary-alt">Questions</span>
        </h2>

        <div 
          ref={faqsRef}
          className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6 md:p-8"
        >
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              toggleOpen={() => toggleFAQ(index)}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;