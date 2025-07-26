'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store';
import { addItem } from '@/store/slices/cartSlice';
import { gsap } from 'gsap';

interface MealCardProps {
  meal: {
    id: string;
    name: string;
    description: string;
    price: number;
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    image: string;
    category: string;
    tags?: string[];
    rating?: number;
    reviewCount?: number;
  };
  showNutrition?: boolean;
  showAddToCart?: boolean;
  className?: string;
}

export default function MealCard({ meal, showNutrition = true, showAddToCart = true, className = '' }: MealCardProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [addedToCart, setAddedToCart] = useState(false);
  
  // Handle add to cart
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigating to meal details
    
    dispatch(addItem({
      id: meal.id,
      name: meal.name,
      description: meal.description,
      price: meal.price,
      quantity: 1,
      image: meal.image,
    }));
    
    // Show added to cart animation
    setAddedToCart(true);
    
    // Animate the success indicator
    const mealCard = document.getElementById(`meal-${meal.id}`);
    if (mealCard) {
      gsap.fromTo(
        mealCard.querySelector('.add-to-cart-success'),
        { opacity: 0, scale: 0.5 },
        { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(1.7)' }
      );
      
      // Reset after animation
      setTimeout(() => {
        setAddedToCart(false);
      }, 2000);
    }
  };
  
  // Handle view meal details
  const handleViewMealDetails = () => {
    router.push(`/meals/${meal.id}`);
  };
  
  return (
    <div 
      id={`meal-${meal.id}`}
      className={`bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1 ${className}`}
      onClick={handleViewMealDetails}
    >
      <div className="h-48 bg-gray-200 relative cursor-pointer">
        {meal.image ? (
          <Image 
            src={meal.image} 
            alt={meal.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        
        {/* Category tag */}
        <div className="absolute top-2 left-2 bg-teal-500 text-white text-xs font-bold px-2 py-1 rounded">
          {meal.category.charAt(0).toUpperCase() + meal.category.slice(1)}
        </div>
        
        {/* Rating */}
        {meal.rating && (
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
            <svg className="w-3 h-3 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {meal.rating} {meal.reviewCount && `(${meal.reviewCount})`}
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1 cursor-pointer hover:text-teal-600 transition-colors duration-300">
          {meal.name}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{meal.description}</p>
        
        {/* Nutrition info */}
        {showNutrition && meal.calories && meal.protein && meal.carbs && meal.fat && (
          <div className="flex justify-between text-xs text-gray-500 mb-3">
            <span>{meal.calories} cal</span>
            <span>{meal.protein}g protein</span>
            <span>{meal.carbs}g carbs</span>
            <span>{meal.fat}g fat</span>
          </div>
        )}
        
        {/* Tags */}
        {meal.tags && meal.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {meal.tags.slice(0, 3).map((tag) => (
              <span 
                key={tag} 
                className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
            {meal.tags.length > 3 && (
              <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                +{meal.tags.length - 3}
              </span>
            )}
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold">${meal.price.toFixed(2)}</span>
          
          {showAddToCart && (
            <button
              onClick={handleAddToCart}
              disabled={addedToCart}
              className="px-3 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors duration-300 flex items-center relative overflow-hidden"
            >
              {addedToCart ? (
                <div className="add-to-cart-success flex items-center">
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Added
                </div>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Add
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}