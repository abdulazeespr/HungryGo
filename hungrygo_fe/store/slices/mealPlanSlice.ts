import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface MealPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  isPopular?: boolean;
  mealType: 'vegetarian' | 'non-vegetarian' | 'mixed';
}

interface MealPlanState {
  mealPlans: MealPlan[];
  loading: boolean;
  error: string | null;
}

const initialState: MealPlanState = {
  mealPlans: [],
  loading: false,
  error: null,
};

// Mock data for development - will be replaced with actual API call
const mockMealPlans: MealPlan[] = [
  {
    id: '1',
    name: 'Basic Plan',
    description: 'Perfect for individuals looking for simple, healthy meals',
    price: 99,
    features: [
      '5 meals per week',
      'Free delivery',
      'Basic meal options',
      'Weekly menu rotation',
    ],
    mealType: 'mixed',
  },
  {
    id: '2',
    name: 'Family Plan',
    description: 'Designed for families with varied tastes and preferences',
    price: 199,
    features: [
      '12 meals per week',
      'Free delivery',
      'Family-sized portions',
      'Kid-friendly options',
      'Customizable meals',
    ],
    isPopular: true,
    mealType: 'mixed',
  },
  {
    id: '3',
    name: 'Premium Plan',
    description: 'Gourmet meals prepared by professional chefs',
    price: 149,
    features: [
      '7 meals per week',
      'Free priority delivery',
      'Premium ingredients',
      'Chef-curated recipes',
      'Wine pairing suggestions',
    ],
    mealType: 'non-vegetarian',
  },
  {
    id: '4',
    name: 'Vegetarian Delight',
    description: 'Plant-based meals packed with flavor and nutrition',
    price: 129,
    features: [
      '7 meals per week',
      'Free delivery',
      '100% vegetarian ingredients',
      'Protein-rich options',
      'Seasonal produce',
    ],
    mealType: 'vegetarian',
  },
  {
    id: '5',
    name: 'Fitness Plan',
    description: 'High-protein meals designed for active lifestyles',
    price: 159,
    features: [
      '10 meals per week',
      'Free delivery',
      'Macro-balanced meals',
      'High protein options',
      'Nutrition information provided',
    ],
    mealType: 'mixed',
  },
  {
    id: '6',
    name: 'Vegan Supreme',
    description: 'Delicious plant-based meals with no animal products',
    price: 139,
    features: [
      '7 meals per week',
      'Free delivery',
      '100% plant-based',
      'Environmentally friendly packaging',
      'Seasonal ingredients',
    ],
    mealType: 'vegetarian',
  },
];

// Async thunk for fetching meal plans
export const fetchMealPlans = createAsyncThunk(
  'mealPlans/fetchMealPlans',
  async (_, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      // const response = await fetch('/api/meal-plans');
      // if (!response.ok) throw new Error('Failed to fetch meal plans');
      // return await response.json();
      
      // For now, return mock data after a short delay to simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      return mockMealPlans;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const mealPlanSlice = createSlice({
  name: 'mealPlans',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMealPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMealPlans.fulfilled, (state, action: PayloadAction<MealPlan[]>) => {
        state.loading = false;
        state.mealPlans = action.payload;
      })
      .addCase(fetchMealPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch meal plans';
      });
  },
});

export default mealPlanSlice.reducer;