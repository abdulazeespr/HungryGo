import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

// Import reducers
import uiReducer from './slices/uiSlice';
import mealPlanReducer from './slices/mealPlanSlice';
import mealScheduleReducer from './slices/mealScheduleSlice';
import orderReducer from './slices/orderSlice';
import userReducer from './slices/userSlice';
import supportReducer from './slices/supportSlice';
import cartReducer from './slices/cartSlice';
// Future reducers will be imported here
// Example: import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    mealPlans: mealPlanReducer,
    mealSchedule: mealScheduleReducer,
    orders: orderReducer,
    user: userReducer,
    support: supportReducer,
    cart: cartReducer,
    // Add more reducers here as needed
    // Example: auth: authReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;