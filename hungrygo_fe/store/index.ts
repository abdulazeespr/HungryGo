import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

// Import reducers
import uiReducer from './slices/uiSlice';
// Future reducers will be imported here
// Example: import authReducer from './slices/authSlice';
// Example: import cartReducer from './slices/cartSlice';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    // Add more reducers here as needed
    // Example: auth: authReducer,
    // Example: cart: cartReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;