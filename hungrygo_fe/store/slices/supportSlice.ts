import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Define support ticket interface
export interface SupportTicket {
  id: string;
  subject: string;
  category: string;
  message: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  createdAt: string;
  updatedAt: string;
  attachments?: string[];
  responses?: {
    id: string;
    from: string;
    message: string;
    date: string;
  }[];
}

// Define support request form data interface
export interface SupportRequestFormData {
  subject: string;
  category: string;
  message: string;
  attachments: File[];
}

// Define support state interface
interface SupportState {
  tickets: SupportTicket[];
  loading: boolean;
  error: string | null;
  submitLoading: boolean;
  submitSuccess: boolean;
  submitError: string | null;
}

// Initial state
const initialState: SupportState = {
  tickets: [],
  loading: false,
  error: null,
  submitLoading: false,
  submitSuccess: false,
  submitError: null,
};

// Generate mock support tickets
const generateMockTickets = (): SupportTicket[] => {
  return [
    {
      id: 'TKT-1001',
      subject: 'Missing item in my delivery',
      category: 'delivery-problem',
      message: 'My order #ORD-5789 was missing the side salad that was supposed to come with my meal. Could I get a refund or a credit for this item?',
      status: 'In Progress',
      createdAt: '2023-11-15T14:32:00Z',
      updatedAt: '2023-11-15T16:45:00Z',
      responses: [
        {
          id: 'RSP-001',
          from: 'Support Agent (Sarah)',
          message: 'I apologize for the missing item in your order. I've checked your order details and confirmed that a side salad should have been included. I've issued a credit to your account for the value of the salad ($4.99). The credit will be automatically applied to your next order. Is there anything else I can help you with?',
          date: '2023-11-15T16:45:00Z',
        },
      ],
    },
    {
      id: 'TKT-982',
      subject: 'App keeps crashing when I try to modify my meal plan',
      category: 'app-website',
      message: 'Every time I try to change my meal selections for next week, the app crashes. I'm using an iPhone 13 with the latest iOS version. This has been happening for the past two days.',
      status: 'Open',
      createdAt: '2023-11-12T09:17:00Z',
      updatedAt: '2023-11-12T09:17:00Z',
    },
    {
      id: 'TKT-943',
      subject: 'Request for allergen information',
      category: 'meal-quality',
      message: 'I recently developed a sensitivity to nightshades. Could you provide detailed ingredient information for the Mediterranean Bowl? I want to make sure it doesn't contain tomatoes, peppers, or eggplant.',
      status: 'Resolved',
      createdAt: '2023-11-05T11:23:00Z',
      updatedAt: '2023-11-07T14:10:00Z',
      responses: [
        {
          id: 'RSP-002',
          from: 'Support Agent (Michael)',
          message: 'Thank you for reaching out about your dietary needs. I've checked with our culinary team, and I can confirm that our Mediterranean Bowl does contain diced tomatoes and roasted red peppers, which are both nightshades. However, we can customize this dish for you by removing these ingredients. Would you like me to set up a custom version of this meal for your account?',
          date: '2023-11-06T10:30:00Z',
        },
        {
          id: 'RSP-003',
          from: 'You',
          message: 'Yes, that would be great! Thank you for checking and offering the customization.',
          date: '2023-11-06T15:45:00Z',
        },
        {
          id: 'RSP-004',
          from: 'Support Agent (Michael)',
          message: 'I've created a custom version of the Mediterranean Bowl without tomatoes and peppers for your account. You'll see this option available when selecting your next meals. The system will automatically substitute extra cucumbers and olives to maintain the flavor profile. Please let us know if you need any other customizations!',
          date: '2023-11-07T14:10:00Z',
        },
      ],
    },
  ];
};

// Async thunk for fetching support tickets
export const fetchSupportTickets = createAsyncThunk(
  'support/fetchTickets',
  async (_, { rejectWithValue }) => {
    try {
      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would be an API call
      // const response = await fetch('/api/support/tickets');
      // const data = await response.json();
      // return data;
      
      return generateMockTickets();
    } catch (error) {
      return rejectWithValue('Failed to fetch support tickets');
    }
  }
);

// Async thunk for submitting a support request
export const submitSupportRequest = createAsyncThunk(
  'support/submitRequest',
  async (formData: SupportRequestFormData, { rejectWithValue }) => {
    try {
      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, this would be an API call with FormData
      // const formDataObj = new FormData();
      // formDataObj.append('subject', formData.subject);
      // formDataObj.append('category', formData.category);
      // formDataObj.append('message', formData.message);
      // formData.attachments.forEach(file => {
      //   formDataObj.append('attachments', file);
      // });
      // 
      // const response = await fetch('/api/support/tickets', {
      //   method: 'POST',
      //   body: formDataObj,
      // });
      // const data = await response.json();
      // return data;
      
      // Create a mock response
      const newTicket: SupportTicket = {
        id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
        subject: formData.subject,
        category: formData.category,
        message: formData.message,
        status: 'Open',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        attachments: formData.attachments.map(file => file.name),
      };
      
      return newTicket;
    } catch (error) {
      return rejectWithValue('Failed to submit support request');
    }
  }
);

// Create support slice
const supportSlice = createSlice({
  name: 'support',
  initialState,
  reducers: {
    clearSubmitStatus: (state) => {
      state.submitSuccess = false;
      state.submitError = null;
    },
  },
  extraReducers: (builder) => {
    // Handle fetchSupportTickets
    builder
      .addCase(fetchSupportTickets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSupportTickets.fulfilled, (state, action: PayloadAction<SupportTicket[]>) => {
        state.loading = false;
        state.tickets = action.payload;
      })
      .addCase(fetchSupportTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch support tickets';
      })
      
      // Handle submitSupportRequest
      .addCase(submitSupportRequest.pending, (state) => {
        state.submitLoading = true;
        state.submitError = null;
        state.submitSuccess = false;
      })
      .addCase(submitSupportRequest.fulfilled, (state, action: PayloadAction<SupportTicket>) => {
        state.submitLoading = false;
        state.tickets = [action.payload, ...state.tickets];
        state.submitSuccess = true;
      })
      .addCase(submitSupportRequest.rejected, (state, action) => {
        state.submitLoading = false;
        state.submitError = action.payload as string || 'Failed to submit support request';
        state.submitSuccess = false;
      });
  },
});

export const { clearSubmitStatus } = supportSlice.actions;
export default supportSlice.reducer;