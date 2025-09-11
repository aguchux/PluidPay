import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface AppState {
  accessToken: string | null;
  startSending?: boolean;
  fromCurrency?: string;
  toCurrency?: string;
  fromAmount?: number;
  toAmount?: number;
}

const initialState: AppState = {
  accessToken: null,
  startSending: false,
  fromCurrency: 'GBP',
  toCurrency: 'GBP',
  fromAmount: 0.0,
  toAmount: 0.0,
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
    setFromCurrency: (state, action: PayloadAction<string>) => {
      state.fromCurrency = action.payload;
    },
    setToCurrency: (state, action: PayloadAction<string>) => {
      state.toCurrency = action.payload;
    },
    setFromAmount: (state, action: PayloadAction<number>) => {
      state.fromAmount = action.payload;
    },
    setToAmount: (state, action: PayloadAction<number>) => {
      state.toAmount = action.payload;
    },
  },
});

export const {
  setAccessToken,
  setStartSending,
  setFromCurrency,
  setToCurrency,
  setFromAmount,
  setToAmount,
} = appSlice.actions;

export default appSlice.reducer;
