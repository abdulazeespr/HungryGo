'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import MealDetail from '@/components/meals/MealDetail';

interface Meal {
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
}

interface Review {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  userImage?: string;
}

export default function MealDetailPage() {
  const params = useParams();
  const router = useRouter();
  const mealId = params.id as string;
  
  const [meal, setMeal] = useState<Meal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  
  // Fetch meal data
  useEffect(() => {
    const fetchMeal = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // In a real app, this would be an API call
        // const response = await fetch(`/api/meals/${mealId}`);
        // if (!response.ok) throw new Error('Failed to fetch meal');
        // const data = await response.json();
        
        // For now, use mock data
        await new Promise(resolve => setTimeout(resolve, 800));
        const mockMeal = generateMockMeal(mealId);
        if (!mockMeal) throw new Error('Meal not found');
        
        setMeal(mockMeal);
        setReviews(generateMockReviews());
        setLoading(false);
      } catch (err) {
        setError('Failed to load meal details. Please try again.');
        setLoading(false);
      }
    };
    
    if (mealId) {
      fetchMeal();
    }
  }, [mealId]);
  
  // Handle go back
  const handleGoBack = () => {
    router.back();
  };
  
  // Generate mock meal data
  const generateMockMeal = (id: string): Meal | null => {
    const mockMeals: Record<string, Meal> = {
      'meal-1': {
        id: 'meal-1',
        name: 'Grilled Chicken Bowl',
        description: 'Tender grilled chicken with mixed vegetables and brown rice, topped with our signature sauce. This balanced meal provides a perfect combination of protein, complex carbohydrates, and essential nutrients to fuel your day. Each ingredient is carefully selected for maximum nutrition and flavor.',
        price: 12.99,
        calories: 450,
        protein: 35,
        carbs: 40,
        fat: 15,
        ingredients: ['Chicken breast', 'Brown rice', 'Broccoli', 'Bell peppers', 'Carrots', 'Olive oil', 'Herbs and spices', 'Signature sauce'],
        allergens: ['None'],
        image: '/images/meals/grilled-chicken-bowl.jpg',
        category: 'lunch',
        tags: ['high-protein', 'gluten-free'],
        rating: 4.8,
        reviewCount: 124,
      },
      'meal-2': {
        id: 'meal-2',
        name: 'Vegetarian Stir Fry',
        description: 'Fresh vegetables stir-fried with tofu and quinoa in a savory sauce. This plant-based meal is packed with protein and fiber, making it a satisfying option for vegetarians and vegans alike. The colorful mix of vegetables provides a wide range of vitamins and antioxidants.',
        price: 10.99,
        calories: 380,
        protein: 18,
        carbs: 45,
        fat: 12,
        ingredients: ['Tofu', 'Quinoa', 'Broccoli', 'Carrots', 'Snow peas', 'Mushrooms', 'Soy sauce', 'Ginger', 'Garlic'],
        allergens: ['Soy'],
        image: '/images/meals/vegetarian-stir-fry.jpg',
        category: 'dinner',
        tags: ['vegetarian', 'vegan', 'dairy-free'],
        rating: 4.6,
        reviewCount: 98,
      },
      'meal-3': {
        id: 'meal-3',
        name: 'Protein Smoothie Bowl',
        description: 'A refreshing smoothie bowl with mixed berries, banana, protein powder, and topped with granola and seeds. This nutrient-dense breakfast option provides a perfect balance of protein, healthy fats, and complex carbohydrates to start your day right.',
        price: 8.99,
        calories: 320,
        protein: 24,
        carbs: 42,
        fat: 8,
        ingredients: ['Mixed berries', 'Banana', 'Protein powder', 'Almond milk', 'Granola', 'Chia seeds', 'Honey'],
        allergens: ['Nuts'],
        image: '/images/meals/protein-smoothie-bowl.jpg',
        category: 'breakfast',
        tags: ['high-protein', 'vegetarian'],
        rating: 4.7,
        reviewCount: 87,
      },
      'meal-4': {
        id: 'meal-4',
        name: 'Keto Salmon Plate',
        description: 'Grilled salmon fillet with avocado, mixed greens, and lemon butter sauce. This keto-friendly meal is rich in omega-3 fatty acids, high-quality protein, and healthy fats, making it perfect for those following a low-carb lifestyle.',
        price: 14.99,
        calories: 520,
        protein: 32,
        carbs: 8,
        fat: 38,
        ingredients: ['Salmon fillet', 'Avocado', 'Mixed greens', 'Lemon', 'Butter', 'Olive oil', 'Herbs'],
        allergens: ['Fish', 'Dairy'],
        image: '/images/meals/keto-salmon-plate.jpg',
        category: 'dinner',
        tags: ['keto', 'low-carb', 'gluten-free', 'high-protein'],
        rating: 4.9,
        reviewCount: 112,
      },
    };
    
    return mockMeals[id] || null;
  };
  
  // Generate mock reviews
  const generateMockReviews = (): Review[] => {
    return [
      {
        id: 'review-1',
        userName: 'Sarah Johnson',
        rating: 5,
        date: '2023-10-15',
        comment: 'Absolutely delicious! The portion size was perfect and the flavors were amazing. Will definitely order again.',
        userImage: '/images/avatars/avatar-1.jpg',
      },
      {
        id: 'review-2',
        userName: 'Michael Chen',
        rating: 4,
        date: '2023-10-10',
        comment: 'Really enjoyed this meal. Fresh ingredients and great taste. Would have given 5 stars but it arrived a bit cold.',
        userImage: '/images/avatars/avatar-2.jpg',
      },
      {
        id: 'review-3',
        userName: 'Emily Rodriguez',
        rating: 5,
        date: '2023-09-28',
        comment: 'Perfect for my diet plan! Tasty, nutritious, and keeps me full for hours. Highly recommend!',
        userImage: '/images/avatars/avatar-3.jpg',
      },
      {
        id: 'review-4',
        userName: 'David Wilson',
        rating: 4,
        date: '2023-09-22',
        comment: 'Great meal option for busy days. Tastes homemade and the ingredients are clearly fresh.',
      },
    ];
  };
  
  // No longer needed as these are now in the MealDetail component
  
  if (loading) {
    return (
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-200 rounded-lg"></div>
              <div>
                <div className="h-10 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-6"></div>
                <div className="h-10 bg-gray-200 rounded w-full mb-4"></div>
                <div className="h-12 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !meal) {
    return (
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <button 
            onClick={handleGoBack}
            className="flex items-center text-teal-600 hover:text-teal-700 mb-6 transition-colors duration-300"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Meals
          </button>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <svg className="w-12 h-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Meal Details</h2>
            <p className="text-red-600 mb-4">{error || 'Meal not found'}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <MealDetail 
          meal={meal}
          reviews={reviews}
          onGoBack={handleGoBack}
        />
      </div>
    </div>
  );
}