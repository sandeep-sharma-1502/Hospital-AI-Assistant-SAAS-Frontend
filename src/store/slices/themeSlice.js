import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isDarkMode: localStorage.getItem('theme') === 'dark',
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.isDarkMode = !state.isDarkMode;
      const root = window.document.documentElement;
      if (state.isDarkMode) {
        root.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        root.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    },
    // Yeh woh function hai jo error de raha tha
    syncTheme: (state) => {
      const root = window.document.documentElement;
      if (state.isDarkMode) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  },
});

// Important: Dono ko yahan se export karna zaroori hai
export const { toggleTheme, syncTheme } = themeSlice.actions; 
export default themeSlice.reducer;