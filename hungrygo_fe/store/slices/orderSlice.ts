import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  date: string;
  status: 'pending' | 'preparing' | 'delivering' | 'delivered' | 'cancelled';
  items: OrderItem[];
  total: number;
  deliveryAddress: string;
  deliveryTime: string;
}

interface OrderState {
  orders: Order[];
  loading: boolean;
  error: string | null;
  orderSuccess: boolean;
}

const initialState: OrderState = {
  orders: [],
  loading: false,
  error: null,
  orderSuccess: false,
};

// Mock data for development - will be replaced with actual API call
const generateMockOrders = (): Order[] => {
  const statuses: ('pending' | 'preparing' | 'delivering' | 'delivered' | 'cancelled')[] = [
    'pending', 'preparing', 'delivering', 'delivered', 'cancelled'
  ];
  
  const mockMeals = [
    { id: 'm1', name: 'Grilled Salmon Bowl', price: 12.99 },
    { id: 'm2', name: 'Vegetable Curry', price: 10.99 },
    { id: 'm3', name: 'Chicken Caesar Salad', price: 9.99 },
    { id: 'm4', name: 'Beef Stir Fry', price: 13.99 },
    { id: 'm5', name: 'Mediterranean Pasta', price: 11.99 },
    { id: 'm6', name: 'Tofu Stir Fry', price: 10.99 },
  ];
  
  const addresses = [
    '123 Main St, Apt 4B, New York, NY 10001',
    '456 Oak Ave, Chicago, IL 60611',
    '789 Pine Rd, San Francisco, CA 94102',
    '321 Maple Dr, Austin, TX 78701',
  ];
  
  const mockOrders: Order[] = [];
  
  // Generate 10 random orders
  for (let i = 1; i <= 10; i++) {
    // Generate random date within the last 30 days
    const orderDate = new Date();
    orderDate.setDate(orderDate.getDate() - Math.floor(Math.random() * 30));
    
    // Generate random time
    const hours = Math.floor(Math.random() * 12) + 1;
    const minutes = Math.floor(Math.random() * 4) * 15; // 0, 15, 30, or 45
    const ampm = Math.random() > 0.5 ? 'AM' : 'PM';
    const deliveryTime = `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    
    // Generate random items (1-4 items per order)
    const numItems = Math.floor(Math.random() * 4) + 1;
    const items: OrderItem[] = [];
    let total = 0;
    
    for (let j = 0; j < numItems; j++) {
      const meal = mockMeals[Math.floor(Math.random() * mockMeals.length)];
      const quantity = Math.floor(Math.random() * 2) + 1; // 1 or 2
      const itemTotal = meal.price * quantity;
      
      items.push({
        id: `${meal.id}-${j}`,
        name: meal.name,
        quantity,
        price: meal.price,
      });
      
      total += itemTotal;
    }
    
    // Add delivery fee
    const deliveryFee = 3.99;
    total += deliveryFee;
    
    // Round to 2 decimal places
    total = Math.round(total * 100) / 100;
    
    // Generate random status (weighted towards delivered for older orders)
    const daysSinceOrder = (new Date().getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24);
    let status: 'pending' | 'preparing' | 'delivering' | 'delivered' | 'cancelled';
    
    if (daysSinceOrder > 7) {
      // Older orders are more likely to be delivered or cancelled
      status = Math.random() > 0.2 ? 'delivered' : 'cancelled';
    } else if (daysSinceOrder > 3) {
      // Medium-age orders could be in any final state
      const rand = Math.random();
      if (rand < 0.7) status = 'delivered';
      else if (rand < 0.85) status = 'cancelled';
      else status = 'delivering';
    } else {
      // Recent orders could be in any state
      status = statuses[Math.floor(Math.random() * statuses.length)];
    }
    
    mockOrders.push({
      id: `order-${i.toString().padStart(6, '0')}`,
      date: orderDate.toISOString(),
      status,
      items,
      total,
      deliveryAddress: addresses[Math.floor(Math.random() * addresses.length)],
      deliveryTime,
    });
  }
  
  // Sort by date (newest first)
  return mockOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Async thunk for fetching orders
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      // const response = await fetch('/api/orders');
      // if (!response.ok) throw new Error('Failed to fetch orders');
      // return await response.json();
      
      // For now, return mock data after a short delay to simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      return generateMockOrders();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Async thunk for creating a new order
export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData: any, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      // const response = await fetch('/api/orders', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(orderData),
      // });
      // if (!response.ok) throw new Error('Failed to create order');
      // return await response.json();
      
      // For now, simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate success or random failure (10% chance of failure for testing)
      if (Math.random() > 0.1) {
        return {
          id: `order-${Math.floor(100000 + Math.random() * 900000)}`,
          date: new Date().toISOString(),
          status: 'pending' as const,
          ...orderData,
        };
      } else {
        return rejectWithValue('Payment processing failed. Please try again.');
      }
    } catch (error) {
      return rejectWithValue((error as Error).message || 'Failed to create order');
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    resetOrderSuccess: (state) => {
      state.orderSuccess = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch orders cases
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action: PayloadAction<Order[]>) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch orders';
      })
      
      // Create order cases
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.orderSuccess = false;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orderSuccess = true;
        // Add the new order to the orders array
        state.orders = [action.payload, ...state.orders];
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.orderSuccess = false;
        state.error = action.payload as string || 'Failed to create order';
      });
  },
});

export const { resetOrderSuccess } = orderSlice.actions;
export default orderSlice.reducer;