'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchMealSchedule, toggleSkipMeal } from '@/store/slices/mealScheduleSlice';
import { gsap } from 'gsap';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';

interface Meal {
  id: string;
  date: string;
  type: 'lunch' | 'dinner';
  name: string;
  description: string;
  image: string;
  calories: number;
  dietaryTags: string[];
  isSkipped: boolean;
}

export default function MealSchedulePage() {
  const dispatch = useAppDispatch();
  const { meals, loading, error } = useAppSelector((state) => state.mealSchedule);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedMealType, setSelectedMealType] = useState<'lunch' | 'dinner'>('lunch');
  const [calendarDates, setCalendarDates] = useState<Date[]>([]);

  // Generate calendar dates (7 days starting from today)
  useEffect(() => {
    const startDate = startOfWeek(new Date(), { weekStartsOn: 1 }); // Start from Monday
    const dates = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));
    setCalendarDates(dates);
  }, []);

  // Fetch meal schedule data
  useEffect(() => {
    dispatch(fetchMealSchedule());
  }, [dispatch]);

  // Setup GSAP animations
  useEffect(() => {
    if (!loading && meals.length > 0) {
      // Animate meal cards
      gsap.fromTo(
        '.meal-card',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
      );

      // Animate calendar
      gsap.fromTo(
        '.date-item',
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.3, stagger: 0.05, ease: 'back.out(1.7)' }
      );
    }
  }, [loading, meals]);

  // Filter meals by selected date and meal type
  const filteredMeals = meals.filter(
    (meal) => {
      const mealDate = new Date(meal.date);
      return isSameDay(mealDate, selectedDate) && meal.type === selectedMealType;
    }
  );

  // Handle skip meal toggle
  const handleSkipMeal = (mealId: string) => {
    dispatch(toggleSkipMeal(mealId));
  };

  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-center">Your Meal Schedule</h1>

        {/* Calendar strip */}
        <div className="mb-10 overflow-x-auto">
          <div className="flex space-x-4 min-w-max py-2 px-4">
            {calendarDates.map((date, index) => (
              <div
                key={index}
                className={`date-item flex flex-col items-center justify-center p-4 rounded-lg cursor-pointer transition-all duration-300 ${isSameDay(date, selectedDate) ? 'bg-teal-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                onClick={() => setSelectedDate(date)}
              >
                <span className="text-sm font-medium">{format(date, 'EEE')}</span>
                <span className="text-xl font-bold">{format(date, 'd')}</span>
                <span className="text-xs">{format(date, 'MMM')}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Meal type toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 p-1 rounded-full flex">
            <button
              className={`px-6 py-2 rounded-full transition-all duration-300 ${selectedMealType === 'lunch' ? 'bg-teal-500 text-white' : 'text-gray-700'}`}
              onClick={() => setSelectedMealType('lunch')}
            >
              Lunch
            </button>
            <button
              className={`px-6 py-2 rounded-full transition-all duration-300 ${selectedMealType === 'dinner' ? 'bg-teal-500 text-white' : 'text-gray-700'}`}
              onClick={() => setSelectedMealType('dinner')}
            >
              Dinner
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
            <p>Error loading meal schedule. Please try again later.</p>
          </div>
        ) : filteredMeals.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No meals scheduled</h3>
            <p className="text-gray-500 mb-6">You don't have any {selectedMealType} scheduled for this day.</p>
            <button className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors duration-300">
              Add a Meal
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMeals.map((meal) => (
              <div 
                key={meal.id} 
                className={`meal-card rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg ${meal.isSkipped ? 'opacity-60' : ''}`}
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={meal.image || 'https://via.placeholder.com/400x300'} 
                    alt={meal.name} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  {meal.isSkipped && (
                    <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">Skipped</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold">{meal.name}</h3>
                    <span className="text-sm bg-gray-100 px-2 py-1 rounded">{meal.calories} cal</span>
                  </div>
                  <p className="text-gray-600 mb-4">{meal.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {meal.dietaryTags.map((tag, index) => (
                      <span key={index} className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="mr-2 text-sm text-gray-600">Skip this meal</span>
                      <button 
                        onClick={() => handleSkipMeal(meal.id)}
                        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 ease-in-out ${meal.isSkipped ? 'bg-gray-400' : 'bg-teal-500'}`}
                      >
                        <span 
                          className={`inline-block w-4 h-4 transform transition-transform duration-300 ease-in-out bg-white rounded-full ${meal.isSkipped ? 'translate-x-6' : 'translate-x-1'}`} 
                        />
                      </button>
                    </div>
                    <button className="text-teal-500 hover:text-teal-700 transition-colors duration-300">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}