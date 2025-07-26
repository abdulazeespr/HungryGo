'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useAppDispatch } from '@/store';
import { addItem } from '@/store/slices/cartSlice';
import { gsap } from 'gsap';

interface MealDetailProps {
  meal: {
    id: string;
    name: string;
    description: string;
    price: number;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    ingredients: string[];
    allergens: string[];
    image: string;
    category: string;
    tags: string[];
    rating: number;
    reviewCount: number;
  };
  reviews: Array<{
    id: string;
    userName: string;
    rating: number;
    date: string;
    comment: string;
    userImage?: string;
  }>;
  onGoBack: () => void;
}

export default function MealDetail({ meal, reviews, onGoBack }: MealDetailProps) {
  const dispatch = useAppDispatch();
  
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  
  const mealImageRef = useRef<HTMLDivElement>(null);
  const mealInfoRef = useRef<HTMLDivElement>(null);
  const nutritionRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  
  // Animations
  useEffect(() => {
    if (mealImageRef.current && mealInfoRef.current && nutritionRef.current && tabsRef.current) {
      // Animate meal image
      gsap.fromTo(
        mealImageRef.current,
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' }
      );
      
      // Animate meal info
      gsap.fromTo(
        mealInfoRef.current,
        { opacity: 0, x: 30 },
        { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out', delay: 0.2 }
      );
      
      // Animate nutrition info
      gsap.fromTo(
        nutritionRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', delay: 0.4 }
      );
      
      // Animate tabs
      gsap.fromTo(
        tabsRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', delay: 0.6 }
      );
      
      // Animate reviews
      gsap.fromTo(
        '.review-item',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.4, ease: 'power2.out', delay: 0.8 }
      );
    }
  }, []);
  
  // Handle quantity change
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };
  
  // Handle add to cart
  const handleAddToCart = () => {
    dispatch(addItem({
      id: meal.id,
      name: meal.name,
      description: meal.description,
      price: meal.price,
      quantity: quantity,
      image: meal.image,
    }));
    
    // Show added to cart animation
    setAddedToCart(true);
    
    // Reset after animation
    setTimeout(() => {
      setAddedToCart(false);
    }, 2000);
  };
  
  // Render star rating
  const renderStarRating = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        // Full star
        stars.push(
          <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      } else if (i - 0.5 <= rating) {
        // Half star
        stars.push(
          <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <defs>
              <linearGradient id="half-star-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="#D1D5DB" />
              </linearGradient>
            </defs>
            <path fill="url(#half-star-gradient)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      } else {
        // Empty star
        stars.push(
          <svg key={i} className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      }
    }
    return stars;
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  return (
    <div>
      {/* Back button */}
      <button 
        onClick={onGoBack}
        className="flex items-center text-teal-600 hover:text-teal-700 mb-6 transition-colors duration-300"
      >
        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Meals
      </button>
      
      {/* Meal details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Meal image */}
        <div ref={mealImageRef} className="relative h-96 bg-gray-100 rounded-lg overflow-hidden">
          {meal.image ? (
            <Image 
              src={meal.image} 
              alt={meal.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          
          {/* Category tag */}
          <div className="absolute top-4 left-4 bg-teal-500 text-white text-sm font-bold px-3 py-1 rounded">
            {meal.category.charAt(0).toUpperCase() + meal.category.slice(1)}
          </div>
        </div>
        
        {/* Meal info */}
        <div ref={mealInfoRef}>
          <h1 className="text-3xl font-bold mb-2">{meal.name}</h1>
          
          {/* Rating */}
          <div className="flex items-center mb-4">
            <div className="flex mr-2">
              {renderStarRating(meal.rating)}
            </div>
            <span className="text-gray-600">{meal.rating.toFixed(1)} ({meal.reviewCount} reviews)</span>
          </div>
          
          <p className="text-gray-700 mb-6">{meal.description}</p>
          
          {/* Price and quantity */}
          <div className="flex items-center justify-between mb-6">
            <span className="text-2xl font-bold">${meal.price.toFixed(2)}</span>
            
            <div className="flex items-center">
              <button 
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
                className="w-10 h-10 rounded-l-lg bg-gray-100 flex items-center justify-center border border-gray-300 disabled:opacity-50"
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                </svg>
              </button>
              <div className="w-12 h-10 flex items-center justify-center border-t border-b border-gray-300 bg-white">
                {quantity}
              </div>
              <button 
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= 10}
                className="w-10 h-10 rounded-r-lg bg-gray-100 flex items-center justify-center border border-gray-300 disabled:opacity-50"
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Add to cart button */}
          <button
            onClick={handleAddToCart}
            disabled={addedToCart}
            className="w-full py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors duration-300 flex items-center justify-center relative overflow-hidden"
          >
            {addedToCart ? (
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Added to Cart
              </div>
            ) : (
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Add to Cart - ${(meal.price * quantity).toFixed(2)}
              </div>
            )}
          </button>
          
          {/* Tags */}
          <div className="mt-6">
            <div className="flex flex-wrap gap-2">
              {meal.tags.map((tag) => (
                <span 
                  key={tag} 
                  className="text-sm bg-gray-100 text-gray-800 px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Nutrition info */}
      <div ref={nutritionRef} className="bg-gray-50 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Nutrition Information</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-sm text-gray-500 mb-1">Calories</div>
            <div className="text-2xl font-bold">{meal.calories}</div>
            <div className="text-xs text-gray-500">kcal</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-sm text-gray-500 mb-1">Protein</div>
            <div className="text-2xl font-bold">{meal.protein}</div>
            <div className="text-xs text-gray-500">grams</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-sm text-gray-500 mb-1">Carbs</div>
            <div className="text-2xl font-bold">{meal.carbs}</div>
            <div className="text-xs text-gray-500">grams</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-sm text-gray-500 mb-1">Fat</div>
            <div className="text-2xl font-bold">{meal.fat}</div>
            <div className="text-xs text-gray-500">grams</div>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div ref={tabsRef} className="mb-12">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('description')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'description' ? 'border-teal-500 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Details
            </button>
            <button
              onClick={() => setActiveTab('ingredients')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'ingredients' ? 'border-teal-500 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Ingredients
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'reviews' ? 'border-teal-500 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Reviews ({reviews.length})
            </button>
          </nav>
        </div>
        
        <div className="py-6">
          {activeTab === 'description' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">About this Meal</h2>
              <p className="text-gray-700 mb-4">{meal.description}</p>
              <p className="text-gray-700">
                Our meals are prepared fresh daily using high-quality ingredients. Each meal is designed to provide optimal nutrition while delivering exceptional taste. We never use artificial preservatives, colors, or flavors.
              </p>
            </div>
          )}
          
          {activeTab === 'ingredients' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Ingredients</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
                {meal.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-center">
                    <svg className="w-5 h-5 text-teal-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    {ingredient}
                  </li>
                ))}
              </ul>
              
              <h2 className="text-xl font-semibold mb-4">Allergens</h2>
              <div className="mb-4">
                {meal.allergens.length > 0 && meal.allergens[0] !== 'None' ? (
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {meal.allergens.map((allergen, index) => (
                      <li key={index} className="flex items-center text-red-600">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        {allergen}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-green-600 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    No common allergens
                  </p>
                )}
              </div>
            </div>
          )}
          
          {activeTab === 'reviews' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Customer Reviews</h2>
              
              {reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 pb-6 review-item">
                      <div className="flex items-start">
                        <div className="mr-4">
                          {review.userImage ? (
                            <div className="relative w-12 h-12 rounded-full overflow-hidden">
                              <Image 
                                src={review.userImage} 
                                alt={review.userName}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold">{review.userName}</h3>
                            <span className="text-sm text-gray-500">{formatDate(review.date)}</span>
                          </div>
                          <div className="flex mb-2">
                            {renderStarRating(review.rating)}
                          </div>
                          <p className="text-gray-700">{review.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No reviews yet. Be the first to review this meal!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}