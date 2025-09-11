import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

const getInitialTheme = () => {
  if (typeof window !== 'undefined') {
    return window.localStorage.getItem('theme') || 'light';
  }
  return 'light';
};

export interface ThemeState {
  theme: 'light' | 'dark';
}

const initialState: ThemeState = {
  theme: getInitialTheme() as 'light' | 'dark',
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
  },
});

export const { setTheme, toggleTheme } = themeSlice.actions;

export default themeSlice.reducer;
