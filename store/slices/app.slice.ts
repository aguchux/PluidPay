import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface AppState {
  accessToken: string | null;
}

const initialState: AppState = {
  accessToken: null,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setAccessToken: (state, action: PayloadAction<string | null>) => {
      state.accessToken = action.payload;
    },
  },
});

export const { setAccessToken } = appSlice.actions;

export default appSlice.reducer;
