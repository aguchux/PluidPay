import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface AppState {
  accessToken: string | null;
  startSending?: boolean;
}

const initialState: AppState = {
  accessToken: null,
  startSending: false,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setAccessToken: (state, action: PayloadAction<string | null>) => {
      state.accessToken = action.payload;
    },
    setStartSending: (state, action: PayloadAction<boolean>) => {
      state.startSending = action.payload;
    },
  },
});

export const { setAccessToken, setStartSending } = appSlice.actions;

export default appSlice.reducer;
