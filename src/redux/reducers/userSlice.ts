import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the structure for the user object
interface User {
  email: string;
  name?: string;       // Optional: Add name
  image?: string;      // Optional: Add image URL
  type?: 'credentials' | 'google'; // Optional: Add login type
  verified?: boolean;
}

// Define the state structure
interface UserState {
  isAuthenticated: boolean;
  user: User | null; // Use the User interface here
}

// Define the initial state
const initialState: UserState = {
  isAuthenticated: false,
  user: null,
};

// Define the payload structure for setUser
interface SetUserPayload extends User {}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Update setUser to accept the full User object
    setUser: (state, action: PayloadAction<SetUserPayload>) => {
      state.user = action.payload;
      // Automatically set isAuthenticated based on whether user data exists
      state.isAuthenticated = true;
    },
    // Keep setAuthenticated if needed for other flows, but setUser now handles auth state
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      // Clear relevant localStorage on logout
      localStorage.removeItem('users');
      localStorage.removeItem('signupOTP');
      localStorage.removeItem('signupEmail');
      localStorage.removeItem('resetOTP');
      localStorage.removeItem('resetEmail');
      localStorage.removeItem('authenticated');
      // Potentially call signOut() from next-auth here if using its session management
      // import { signOut } from 'next-auth/react';
      // signOut({ callbackUrl: '/signin' });
    },
  },
});

export const { setUser, logout, setAuthenticated } = userSlice.actions;

export default userSlice.reducer; 