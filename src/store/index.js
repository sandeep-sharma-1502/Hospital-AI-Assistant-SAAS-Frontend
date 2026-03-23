import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './slices/themeSlice';
import adminAuthReducer from './slices/authSlice';
import userAuthReducer from './slices/userAuthSlice';
import assistantReducer from './slices/assistantSlice';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    adminAuth: adminAuthReducer,
    userAuth: userAuthReducer,
    assistant: assistantReducer,  
    // Add other reducers here as we build them (e.g., appointments, sessions)
  },
});