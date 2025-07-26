import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  image?: string;
  options?: string;
}

interface CartState {
  items: CartItem[];
  subtotal: number;
  loading: boolean;
  error: string | null;
}

// Mock data for cart items
const mockCartItems: CartItem[] = [
  {
    id: 'item1',
    name: 'Grilled Chicken Bowl',
    description: 'Grilled chicken with mixed vegetables and brown rice',
    price: 12.99,
    quantity: 1,
    image: '/images/meals/grilled-chicken-bowl.jpg',
  },
  {
    id: 'item2',
    name: 'Vegetarian Stir Fry',
    description: 'Fresh vegetables stir-fried with tofu and quinoa',
    price: 10.99,
    quantity: 2,
    image: '/images/meals/vegetarian-stir-fry.jpg',
    options: 'Extra tofu, No onions',
  },
  {
    id: 'item3',
    name: 'Protein Smoothie',
    description: 'Whey protein with banana, berries, and almond milk',
    price: 6.99,
    quantity: 1,
    image: '/images/meals/protein-smoothie.jpg',
  },
];

// Calculate initial subtotal from mock data
const calculateSubtotal = (items: CartItem[]): number => {
  return Number(items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2));
};

const initialState: CartState = {
  items: [],
  subtotal: 0,
  loading: false,
  error: null,
};

// Async thunk for fetching cart items
export const fetchCartItems = createAsyncThunk(
  'cart/fetchCartItems',
  async (_, { rejectWithValue }) => {
    try {
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // In a real app, this would be an API call
      return mockCartItems;
    } catch (error) {
      return rejectWithValue('Failed to fetch cart items. Please try again.');
    }
  }
);

// Async thunk for updating cart item quantity
export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ id, quantity }: { id: string; quantity: number }, { rejectWithValue }) => {
    try {
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real app, this would be an API call
      return { id, quantity };
    } catch (error) {
      return rejectWithValue('Failed to update item. Please try again.');
    }
  }
);

// Async thunk for removing cart item
export const removeCartItem = createAsyncThunk(
  'cart/removeCartItem',
  async (id: string, { rejectWithValue }) => {
    try {
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real app, this would be an API call
      return id;
    } catch (error) {
      return rejectWithValue('Failed to remove item. Please try again.');
    }
  }
);

// Async thunk for clearing cart
export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real app, this would be an API call
      return true;
    } catch (error) {
      return rejectWithValue('Failed to clear cart. Please try again.');
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Add item to cart (for client-side updates)
    addItem: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      
      state.subtotal = calculateSubtotal(state.items);
    },
    
    // Update item quantity (for client-side updates)
    updateItem: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);
      
      if (item) {
        item.quantity = quantity;
        state.subtotal = calculateSubtotal(state.items);
      }
    },
    
    // Remove item (for client-side updates)
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      state.subtotal = calculateSubtotal(state.items);
    },
    
    // Clear cart (for client-side updates)
    clear: (state) => {
      state.items = [];
      state.subtotal = 0;
    },
  },
  extraReducers: (builder) => {
    // Fetch cart items
    builder
      .addCase(fetchCartItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.subtotal = calculateSubtotal(action.payload);
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
    
    // Update cart item
    builder
      .addCase(updateCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.loading = false;
        const { id, quantity } = action.payload;
        const item = state.items.find(item => item.id === id);
        
        if (item) {
          item.quantity = quantity;
          state.subtotal = calculateSubtotal(state.items);
        }
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
    
    // Remove cart item
    builder
      .addCase(removeCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => item.id !== action.payload);
        state.subtotal = calculateSubtotal(state.items);
      })
      .addCase(removeCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
    
    // Clear cart
    builder
      .addCase(clearCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.loading = false;
        state.items = [];
        state.subtotal = 0;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { addItem, updateItem, removeItem, clear } = cartSlice.actions;
export default cartSlice.reducer;