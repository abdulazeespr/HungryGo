'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchMealPlans } from '@/store/slices/mealPlanSlice';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface MealPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  isPopular?: boolean;
  mealType: 'vegetarian' | 'non-vegetarian' | 'mixed';
}

export default function MealPlansPage() {
  const dispatch = useAppDispatch();
  const { mealPlans, loading, error } = useAppSelector((state) => state.mealPlans);
  const [selectedMealType, setSelectedMealType] = useState<'vegetarian' | 'non-vegetarian' | 'mixed'>('mixed');

  useEffect(() => {
    // Register ScrollTrigger with GSAP
    gsap.registerPlugin(ScrollTrigger);
    
    // Fetch meal plans from API
    dispatch(fetchMealPlans());

    // Cleanup function
    return () => {
      // Kill all ScrollTrigger instances to prevent memory leaks
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [dispatch]);

  useEffect(() => {
    if (mealPlans.length > 0 && !loading) {
      // Animate meal plan cards when they come into view
      const cards = document.querySelectorAll('.meal-plan-card');
      
      gsap.fromTo(cards, 
        { y: 50, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.8, 
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.meal-plans-container',
            start: 'top 80%',
          }
        }
      );

      // Animate price with count-up effect
      gsap.fromTo('.price-value', 
        { textContent: '0' },
        {
          textContent: (i, target) => target.getAttribute('data-value'),
          duration: 2,
          ease: 'power1.inOut',
          snap: { textContent: 1 },
          stagger: 0.2,
          scrollTrigger: {
            trigger: '.meal-plans-container',
            start: 'top 80%',
          }
        }
      );
    }
  }, [mealPlans, loading]);

  // Filter meal plans by selected meal type
  const filteredMealPlans = mealPlans.filter(plan => 
    selectedMealType === 'mixed' ? true : plan.mealType === selectedMealType
  );

  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choose Your Meal Plan</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select the perfect meal plan that fits your lifestyle and dietary preferences.
          </p>
          
          {/* Meal type toggle */}
          <div className="flex justify-center mt-8 space-x-4">
            <button
              className={`px-6 py-2 rounded-full transition-all duration-300 ${selectedMealType === 'vegetarian' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => setSelectedMealType('vegetarian')}
            >
              Vegetarian
            </button>
            <button
              className={`px-6 py-2 rounded-full transition-all duration-300 ${selectedMealType === 'non-vegetarian' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => setSelectedMealType('non-vegetarian')}
            >
              Non-Vegetarian
            </button>
            <button
              className={`px-6 py-2 rounded-full transition-all duration-300 ${selectedMealType === 'mixed' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => setSelectedMealType('mixed')}
            >
              All Plans
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-full bg-gray-200 h-12 w-12"></div>
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500">
            <p>Error loading meal plans. Please try again later.</p>
          </div>
        ) : (
          <div className="meal-plans-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredMealPlans.map((plan) => (
              <div 
                key={plan.id} 
                className={`meal-plan-card rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl ${plan.isPopular ? 'relative border-2 border-yellow-400' : ''}`}
              >
                {plan.isPopular && (
                  <div className="absolute top-0 right-0 bg-yellow-400 text-white px-4 py-1 rounded-bl-lg font-semibold animate-pulse">
                    Most Popular
                  </div>
                )}
                <div className="p-6 bg-white">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">
                      $<span className="price-value" data-value={plan.price}>{plan.price}</span>
                    </span>
                    <span className="text-gray-500">/month</span>
                  </div>
                  <ul className="mb-8 space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button className="w-full py-3 px-4 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-all duration-300 transform hover:scale-105">
                    Choose Plan
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}