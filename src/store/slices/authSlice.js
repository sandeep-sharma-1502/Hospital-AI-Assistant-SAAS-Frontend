import { createSlice } from '@reduxjs/toolkit';

// Browser memory se initial data load karein
const savedToken = localStorage.getItem('adminToken');
const savedUser = localStorage.getItem('adminUser');

const initialState = {
  user: savedUser ? JSON.parse(savedUser) : null,
  token: savedToken ? savedToken : null,
  isAuthenticated: !!savedToken, // Agar token hai toh true, varna false
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      // Memory mein save karein
      localStorage.setItem('adminToken', action.payload.token);
      localStorage.setItem('adminUser', JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      // Memory se delete karein
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;