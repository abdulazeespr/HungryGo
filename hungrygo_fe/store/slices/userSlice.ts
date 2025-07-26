import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Define user profile interface
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  address: string;
  dietaryPreferences: string[];
  allergies: string[];
}

// Define user state interface
interface UserState {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  updateLoading: boolean;
  updateError: string | null;
  updateSuccess: boolean;
}

// Initial state
const initialState: UserState = {
  profile: null,
  loading: false,
  error: null,
  updateLoading: false,
  updateError: null,
  updateSuccess: false,
};

// Mock user data
const mockUserProfile: UserProfile = {
  id: 'usr_123456789',
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1 (555) 123-4567',
  avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  address: '123 Main St, Anytown, CA 94321',
  dietaryPreferences: ['Vegetarian', 'Low Carb'],
  allergies: ['Peanuts', 'Shellfish'],
};

// Async thunk for fetching user profile
export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would be an API call
      // const response = await fetch('/api/user/profile');
      // const data = await response.json();
      // return data;
      
      return mockUserProfile;
    } catch (error) {
      return rejectWithValue('Failed to fetch user profile');
    }
  }
);

// Async thunk for updating user profile
export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async (userData: Partial<UserProfile>, { rejectWithValue }) => {
    try {
      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, this would be an API call
      // const response = await fetch('/api/user/profile', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(userData),
      // });
      // const data = await response.json();
      // return data;
      
      // Return updated user data (merged with mock data)
      return { ...mockUserProfile, ...userData };
    } catch (error) {
      return rejectWithValue('Failed to update user profile');
    }
  }
);

// Create user slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUpdateStatus: (state) => {
      state.updateSuccess = false;
      state.updateError = null;
    },
  },
  extraReducers: (builder) => {
    // Handle fetchUserProfile
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action: PayloadAction<UserProfile>) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch profile';
      })
      
      // Handle updateUserProfile
      .addCase(updateUserProfile.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
        state.updateSuccess = false;
      })
      .addCase(updateUserProfile.fulfilled, (state, action: PayloadAction<UserProfile>) => {
        state.updateLoading = false;
        state.profile = action.payload;
        state.updateSuccess = true;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload as string || 'Failed to update profile';
        state.updateSuccess = false;
      });
  },
});

export const { clearUpdateStatus } = userSlice.actions;
export default userSlice.reducer;