import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  messages: [
    { role: 'bot', content: 'Namaste! Main aapka hospital assistant hoon. Kaise madad karun?' }
  ],
  isAiSpeaking: false,
  isAiListening: false,
  isBooking: false,
  status: 'idle', // 'idle' | 'connected' | 'error'
};

const assistantSlice = createSlice({
  name: 'assistant',
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    setAiSpeaking: (state, action) => {
      state.isAiSpeaking = action.payload;
    },
    setAiListening: (state, action) => {
      state.isAiListening = action.payload;
    },
    setBookingStatus: (state, action) => {
      state.isBooking = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    clearChat: (state) => {
      state.messages = initialState.messages;
    }
  },
});

export const { 
  addMessage, 
  setAiSpeaking, 
  setAiListening, 
  setBookingStatus, 
  setStatus,
  clearChat 
} = assistantSlice.actions;

export default assistantSlice.reducer;
