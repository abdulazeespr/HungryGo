'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store';
import { addItem } from '@/store/slices/cartSlice';
import { gsap } from 'gsap';
import MealCard from '@/components/meals/MealCard';
import MealFilters from '@/components/meals/MealFilters';

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

export default function MealsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  
  // Get category from URL query params
  const categoryParam = searchParams.get('category');
  
  const [meals, setMeals] = useState<Meal[]>([]);
  const [filteredMeals, setFilteredMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dietaryFilters, setDietaryFilters] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState('popularity');
  const [addedToCart, setAddedToCart] = useState<string | null>(null);
  
  const mealsContainerRef = useRef<HTMLDivElement>(null);
  
  // These are now moved to MealFilters component
  
  // Fetch meals data
  useEffect(() => {
    const fetchMeals = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // In a real app, this would be an API call
        // const response = await fetch('/api/meals');
        // if (!response.ok) throw new Error('Failed to fetch meals');
        // const data = await response.json();
        
        // For now, use mock data
        await new Promise(resolve => setTimeout(resolve, 800));
        const mockMeals = generateMockMeals();
        setMeals(mockMeals);
        setFilteredMeals(mockMeals);
        setLoading(false);
      } catch (err) {
        setError('Failed to load meals. Please try again.');
        setLoading(false);
      }
    };
    
    fetchMeals();
  }, []);
  
  // Apply filters when category, search, dietary filters, or sort option changes
  useEffect(() => {
    if (meals.length === 0) return;
    
    let filtered = [...meals];
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(meal => meal.category.toLowerCase() === selectedCategory.toLowerCase());
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(meal => 
        meal.name.toLowerCase().includes(query) || 
        meal.description.toLowerCase().includes(query) ||
        meal.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Filter by dietary preferences
    if (dietaryFilters.length > 0) {
      filtered = filtered.filter(meal => 
        dietaryFilters.every(filter => meal.tags.includes(filter))
      );
    }
    
    // Sort meals
    switch (sortOption) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'calories-low':
        filtered.sort((a, b) => a.calories - b.calories);
        break;
      case 'protein-high':
        filtered.sort((a, b) => b.protein - a.protein);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'popularity':
      default:
        // Already sorted by popularity in mock data
        break;
    }
    
    setFilteredMeals(filtered);
  }, [meals, selectedCategory, searchQuery, dietaryFilters, sortOption]);
  
  // Update URL when category changes
  useEffect(() => {
    if (selectedCategory === 'all') {
      router.push('/meals');
    } else {
      router.push(`/meals?category=${selectedCategory}`);
    }
  }, [selectedCategory, router]);
  
  // Animate meals on load and filter changes
  useEffect(() => {
    if (!loading && filteredMeals.length > 0 && mealsContainerRef.current) {
      gsap.fromTo(
        '.meal-card',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.05, duration: 0.4, ease: 'power2.out' }
      );
    }
  }, [loading, filteredMeals]);
  
  // Handle category change
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };
  
  // Handle dietary filter change
  const handleDietaryFilterChange = (filter: string) => {
    setDietaryFilters(prev => {
      if (prev.includes(filter)) {
        return prev.filter(f => f !== filter);
      } else {
        return [...prev, filter];
      }
    });
  };
  
  // Handle add to cart
  const handleAddToCart = (meal: Meal) => {
    dispatch(addItem({
      id: meal.id,
      name: meal.name,
      description: meal.description,
      price: meal.price,
      quantity: 1,
      image: meal.image,
    }));
    
    // Show added to cart animation
    setAddedToCart(meal.id);
    
    // Animate the meal card
    const mealCard = document.getElementById(`meal-${meal.id}`);
    if (mealCard) {
      gsap.fromTo(
        mealCard.querySelector('.add-to-cart-success'),
        { opacity: 0, scale: 0.5 },
        { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(1.7)' }
      );
      
      // Reset after animation
      setTimeout(() => {
        setAddedToCart(null);
      }, 2000);
    }
  };
  
  // Handle view meal details
  const handleViewMealDetails = (mealId: string) => {
    router.push(`/meals/${mealId}`);
  };
  
  // Generate mock meals data
  const generateMockMeals = (): Meal[] => {
    const mockMeals: Meal[] = [
      {
        id: 'meal-1',
        name: 'Grilled Chicken Bowl',
        description: 'Tender grilled chicken with mixed vegetables and brown rice, topped with our signature sauce.',
        price: 12.99,
        calories: 450,
        protein: 35,
        carbs: 40,
        fat: 15,
        ingredients: ['Chicken breast', 'Brown rice', 'Broccoli', 'Bell peppers', 'Carrots', 'Olive oil', 'Herbs and spices'],
        allergens: ['None'],
        image: '/images/meals/grilled-chicken-bowl.jpg',
        category: 'lunch',
        tags: ['high-protein', 'gluten-free'],
        rating: 4.8,
        reviewCount: 124,
      },
      {
        id: 'meal-2',
        name: 'Vegetarian Stir Fry',
        description: 'Fresh vegetables stir-fried with tofu and quinoa in a savory sauce.',
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
      {
        id: 'meal-3',
        name: 'Protein Smoothie Bowl',
        description: 'A refreshing smoothie bowl with mixed berries, banana, protein powder, and topped with granola and seeds.',
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
      {
        id: 'meal-4',
        name: 'Keto Salmon Plate',
        description: 'Grilled salmon fillet with avocado, mixed greens, and lemon butter sauce.',
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
      {
        id: 'meal-5',
        name: 'Vegan Buddha Bowl',
        description: 'A colorful bowl of quinoa, roasted sweet potatoes, chickpeas, avocado, and tahini dressing.',
        price: 11.99,
        calories: 420,
        protein: 15,
        carbs: 60,
        fat: 16,
        ingredients: ['Quinoa', 'Sweet potatoes', 'Chickpeas', 'Avocado', 'Kale', 'Red cabbage', 'Tahini', 'Lemon juice'],
        allergens: ['Sesame'],
        image: '/images/meals/vegan-buddha-bowl.jpg',
        category: 'lunch',
        tags: ['vegan', 'vegetarian', 'dairy-free', 'gluten-free'],
        rating: 4.7,
        reviewCount: 76,
      },
      {
        id: 'meal-6',
        name: 'Greek Yogurt Parfait',
        description: 'Creamy Greek yogurt layered with fresh berries, honey, and homemade granola.',
        price: 7.99,
        calories: 280,
        protein: 18,
        carbs: 32,
        fat: 10,
        ingredients: ['Greek yogurt', 'Mixed berries', 'Honey', 'Granola', 'Almonds'],
        allergens: ['Dairy', 'Nuts'],
        image: '/images/meals/greek-yogurt-parfait.jpg',
        category: 'breakfast',
        tags: ['vegetarian', 'high-protein'],
        rating: 4.5,
        reviewCount: 64,
      },
      {
        id: 'meal-7',
        name: 'Turkey Meatballs with Zoodles',
        description: 'Lean turkey meatballs served with zucchini noodles and marinara sauce.',
        price: 13.99,
        calories: 380,
        protein: 28,
        carbs: 18,
        fat: 22,
        ingredients: ['Ground turkey', 'Zucchini', 'Tomato sauce', 'Garlic', 'Onions', 'Italian herbs', 'Parmesan cheese'],
        allergens: ['Dairy', 'Eggs'],
        image: '/images/meals/turkey-meatballs-zoodles.jpg',
        category: 'dinner',
        tags: ['low-carb', 'high-protein', 'gluten-free'],
        rating: 4.6,
        reviewCount: 92,
      },
      {
        id: 'meal-8',
        name: 'Protein Energy Bites',
        description: 'No-bake energy bites made with oats, peanut butter, honey, chocolate chips, and protein powder.',
        price: 6.99,
        calories: 220,
        protein: 10,
        carbs: 24,
        fat: 12,
        ingredients: ['Oats', 'Peanut butter', 'Honey', 'Chocolate chips', 'Protein powder', 'Flaxseed'],
        allergens: ['Nuts'],
        image: '/images/meals/protein-energy-bites.jpg',
        category: 'snacks',
        tags: ['vegetarian', 'high-protein'],
        rating: 4.4,
        reviewCount: 58,
      },
      {
        id: 'meal-9',
        name: 'Berry Protein Smoothie',
        description: 'A refreshing smoothie with mixed berries, banana, protein powder, and almond milk.',
        price: 6.99,
        calories: 240,
        protein: 20,
        carbs: 30,
        fat: 5,
        ingredients: ['Mixed berries', 'Banana', 'Protein powder', 'Almond milk', 'Ice'],
        allergens: ['None'],
        image: '/images/meals/berry-protein-smoothie.jpg',
        category: 'drinks',
        tags: ['vegetarian', 'high-protein', 'dairy-free'],
        rating: 4.5,
        reviewCount: 72,
      },
      {
        id: 'meal-10',
        name: 'Chocolate Protein Muffins',
        description: 'Moist chocolate muffins made with protein powder, almond flour, and dark chocolate chips.',
        price: 5.99,
        calories: 260,
        protein: 15,
        carbs: 28,
        fat: 14,
        ingredients: ['Almond flour', 'Protein powder', 'Cocoa powder', 'Dark chocolate chips', 'Eggs', 'Almond milk', 'Honey'],
        allergens: ['Eggs', 'Nuts'],
        image: '/images/meals/chocolate-protein-muffins.jpg',
        category: 'desserts',
        tags: ['gluten-free', 'high-protein'],
        rating: 4.3,
        reviewCount: 45,
      },
      {
        id: 'meal-11',
        name: 'Avocado Toast with Egg',
        description: 'Whole grain toast topped with mashed avocado, poached egg, and microgreens.',
        price: 9.99,
        calories: 340,
        protein: 16,
        carbs: 32,
        fat: 18,
        ingredients: ['Whole grain bread', 'Avocado', 'Eggs', 'Microgreens', 'Lemon juice', 'Red pepper flakes', 'Salt and pepper'],
        allergens: ['Eggs', 'Gluten'],
        image: '/images/meals/avocado-toast-egg.jpg',
        category: 'breakfast',
        tags: ['vegetarian', 'high-protein'],
        rating: 4.7,
        reviewCount: 88,
      },
      {
        id: 'meal-12',
        name: 'Chicken Caesar Salad',
        description: 'Crisp romaine lettuce with grilled chicken, parmesan cheese, croutons, and Caesar dressing.',
        price: 11.99,
        calories: 380,
        protein: 30,
        carbs: 15,
        fat: 22,
        ingredients: ['Romaine lettuce', 'Grilled chicken breast', 'Parmesan cheese', 'Croutons', 'Caesar dressing'],
        allergens: ['Dairy', 'Gluten', 'Eggs'],
        image: '/images/meals/chicken-caesar-salad.jpg',
        category: 'lunch',
        tags: ['high-protein'],
        rating: 4.6,
        reviewCount: 102,
      },
    ];
    
    return mockMeals;
  };
  
  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <h1 className="text-4xl font-bold mb-2 text-center">Browse Our Meals</h1>
        <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
          Discover our wide selection of nutritious and delicious meals, prepared fresh and delivered to your door.
        </p>
        
        {/* Search and Filter Section */}
        <MealFilters
          selectedCategory={selectedCategory}
          searchQuery={searchQuery}
          sortOption={sortOption}
          dietaryFilters={dietaryFilters}
          onCategoryChange={handleCategoryChange}
          onSearchChange={setSearchQuery}
          onSortChange={setSortOption}
          onDietaryFilterChange={handleDietaryFilterChange}
          onResetFilters={() => {
            setSelectedCategory('all');
            setSearchQuery('');
            setDietaryFilters([]);
            setSortOption('popularity');
          }}
        />
        
        {/* Meals Grid */}
        {loading ? (
          // Loading skeleton
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-10 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          // Error state
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <svg className="w-12 h-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Meals</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300"
            >
              Try Again
            </button>
          </div>
        ) : filteredMeals.length === 0 ? (
          // No results
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">No Meals Found</h2>
            <p className="text-gray-600 mb-4 max-w-md mx-auto">
              We couldn't find any meals matching your current filters. Try adjusting your search criteria or dietary preferences.
            </p>
            <button 
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                setDietaryFilters([]);
                setSortOption('popularity');
              }}
              className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors duration-300"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          // Meals grid
          <div ref={mealsContainerRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMeals.map((meal) => (
              <MealCard 
                key={meal.id}
                meal={meal}
                className="meal-card"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}