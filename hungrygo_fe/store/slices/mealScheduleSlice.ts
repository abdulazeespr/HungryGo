import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

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

interface MealScheduleState {
  meals: Meal[];
  loading: boolean;
  error: string | null;
}

const initialState: MealScheduleState = {
  meals: [],
  loading: false,
  error: null,
};

// Generate dates for the next 7 days
const generateDates = () => {
  const dates = [];
  const today = new Date();
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date.toISOString().split('T')[0]);
  }
  
  return dates;
};

// Mock data for development - will be replaced with actual API call
const generateMockMeals = (): Meal[] => {
  const dates = generateDates();
  const mealTypes: ('lunch' | 'dinner')[] = ['lunch', 'dinner'];
  
  const mockMeals: Meal[] = [];
  
  const mealOptions = [
    {
      name: 'Grilled Salmon Bowl',
      description: 'Fresh grilled salmon with quinoa, avocado, and roasted vegetables',
      image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      calories: 450,
      dietaryTags: ['High Protein', 'Gluten Free', 'Omega-3']
    },
    {
      name: 'Vegetable Curry',
      description: 'Spicy vegetable curry with basmati rice and naan bread',
      image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      calories: 380,
      dietaryTags: ['Vegetarian', 'Spicy', 'Fiber Rich']
    },
    {
      name: 'Chicken Caesar Salad',
      description: 'Grilled chicken breast with romaine lettuce, parmesan, and homemade dressing',
      image: 'https://images.unsplash.com/photo-1512852939750-1305098529bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      calories: 320,
      dietaryTags: ['High Protein', 'Low Carb']
    },
    {
      name: 'Beef Stir Fry',
      description: 'Tender beef strips with mixed vegetables and teriyaki sauce',
      image: 'https://images.unsplash.com/photo-1541014741259-de529411b96a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      calories: 410,
      dietaryTags: ['High Protein', 'Iron Rich']
    },
    {
      name: 'Mediterranean Pasta',
      description: 'Whole grain pasta with olives, feta, tomatoes, and herbs',
      image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      calories: 390,
      dietaryTags: ['Vegetarian', 'Mediterranean']
    },
    {
      name: 'Tofu Stir Fry',
      description: 'Crispy tofu with broccoli, bell peppers, and sesame sauce',
      image: 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      calories: 340,
      dietaryTags: ['Vegan', 'Plant Protein', 'Low Calorie']
    },
  ];
  
  let id = 1;
  
  dates.forEach(date => {
    mealTypes.forEach(type => {
      // Randomly select a meal from options
      const randomMeal = mealOptions[Math.floor(Math.random() * mealOptions.length)];
      
      mockMeals.push({
        id: String(id++),
        date,
        type,
        name: randomMeal.name,
        description: randomMeal.description,
        image: randomMeal.image,
        calories: randomMeal.calories,
        dietaryTags: randomMeal.dietaryTags,
        isSkipped: false
      });
    });
  });
  
  return mockMeals;
};

// Async thunk for fetching meal schedule
export const fetchMealSchedule = createAsyncThunk(
  'mealSchedule/fetchMealSchedule',
  async (_, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      // const response = await fetch('/api/schedule');
      // if (!response.ok) throw new Error('Failed to fetch meal schedule');
      // return await response.json();
      
      // For now, return mock data after a short delay to simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      return generateMockMeals();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Async thunk for toggling meal skip status
export const toggleSkipMeal = createAsyncThunk(
  'mealSchedule/toggleSkipMeal',
  async (mealId: string, { getState, rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      // const response = await fetch(`/api/schedule/${mealId}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ isSkipped: !meal.isSkipped }),
      // });
      // if (!response.ok) throw new Error('Failed to update meal');
      // return await response.json();
      
      // For now, just return the meal ID after a short delay to simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      return mealId;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const mealScheduleSlice = createSlice({
  name: 'mealSchedule',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch meal schedule
      .addCase(fetchMealSchedule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMealSchedule.fulfilled, (state, action: PayloadAction<Meal[]>) => {
        state.loading = false;
        state.meals = action.payload;
      })
      .addCase(fetchMealSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch meal schedule';
      })
      
      // Toggle skip meal
      .addCase(toggleSkipMeal.fulfilled, (state, action: PayloadAction<string>) => {
        const mealId = action.payload;
        const meal = state.meals.find(m => m.id === mealId);
        if (meal) {
          meal.isSkipped = !meal.isSkipped;
        }
      });
  },
});

export default mealScheduleSlice.reducer;