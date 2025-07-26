'use client';

import { useState, useEffect } from 'react';

interface MealFiltersProps {
  selectedCategory: string;
  searchQuery: string;
  sortOption: string;
  dietaryFilters: string[];
  onCategoryChange: (category: string) => void;
  onSearchChange: (query: string) => void;
  onSortChange: (sortOption: string) => void;
  onDietaryFilterChange: (filter: string) => void;
  onResetFilters: () => void;
}

export default function MealFilters({
  selectedCategory,
  searchQuery,
  sortOption,
  dietaryFilters,
  onCategoryChange,
  onSearchChange,
  onSortChange,
  onDietaryFilterChange,
  onResetFilters
}: MealFiltersProps) {
  // Mock categories
  const categories = [
    { id: 'all', name: 'All Meals' },
    { id: 'breakfast', name: 'Breakfast' },
    { id: 'lunch', name: 'Lunch' },
    { id: 'dinner', name: 'Dinner' },
    { id: 'snacks', name: 'Snacks & Sides' },
    { id: 'desserts', name: 'Desserts' },
    { id: 'drinks', name: 'Drinks' },
  ];
  
  // Mock dietary options
  const dietaryOptions = [
    { id: 'vegetarian', name: 'Vegetarian' },
    { id: 'vegan', name: 'Vegan' },
    { id: 'gluten-free', name: 'Gluten-Free' },
    { id: 'dairy-free', name: 'Dairy-Free' },
    { id: 'keto', name: 'Keto-Friendly' },
    { id: 'low-carb', name: 'Low-Carb' },
    { id: 'high-protein', name: 'High-Protein' },
  ];
  
  // Sort options
  const sortOptions = [
    { id: 'popularity', name: 'Most Popular' },
    { id: 'rating', name: 'Highest Rated' },
    { id: 'price-low', name: 'Price: Low to High' },
    { id: 'price-high', name: 'Price: High to Low' },
    { id: 'calories-low', name: 'Lowest Calories' },
    { id: 'protein-high', name: 'Highest Protein' },
  ];
  
  // Debounce search input
  const [searchInputValue, setSearchInputValue] = useState(searchQuery);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(searchInputValue);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchInputValue, onSearchChange]);
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Search */}
        <div className="md:col-span-3">
          <div className="relative">
            <input
              type="text"
              value={searchInputValue}
              onChange={(e) => setSearchInputValue(e.target.value)}
              placeholder="Search meals, ingredients, or dietary preferences..."
              className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            {searchInputValue && (
              <button
                onClick={() => setSearchInputValue('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
        
        {/* Categories */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Categories</label>
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>
        
        {/* Sort By */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
          <select
            value={sortOption}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          >
            {sortOptions.map((option) => (
              <option key={option.id} value={option.id}>{option.name}</option>
            ))}
          </select>
        </div>
        
        {/* Reset Filters Button */}
        <div className="flex items-end">
          <button
            onClick={onResetFilters}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-300 w-full flex items-center justify-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset Filters
          </button>
        </div>
        
        {/* Dietary Preferences */}
        <div className="md:col-span-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">Dietary Preferences</label>
          <div className="flex flex-wrap gap-2">
            {dietaryOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => onDietaryFilterChange(option.id)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-300 ${dietaryFilters.includes(option.id) ? 'bg-teal-500 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
              >
                {option.name}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Active Filters Summary */}
      {(selectedCategory !== 'all' || dietaryFilters.length > 0 || searchQuery) && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-600">Active filters:</span>
            
            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                Category: {categories.find(c => c.id === selectedCategory)?.name}
                <button 
                  onClick={() => onCategoryChange('all')} 
                  className="ml-1 text-teal-500 hover:text-teal-700"
                >
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
            
            {dietaryFilters.map(filter => (
              <span key={filter} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                {dietaryOptions.find(o => o.id === filter)?.name}
                <button 
                  onClick={() => onDietaryFilterChange(filter)} 
                  className="ml-1 text-teal-500 hover:text-teal-700"
                >
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
            
            {searchQuery && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                Search: {searchQuery}
                <button 
                  onClick={() => {
                    setSearchInputValue('');
                    onSearchChange('');
                  }} 
                  className="ml-1 text-teal-500 hover:text-teal-700"
                >
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}