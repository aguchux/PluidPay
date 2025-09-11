import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { WiseCurrency } from 'data/currencies';
import { WiseComparison, WiseRate } from 'types/wise.types';

export const wiseApi = createApi({
  reducerPath: 'wiseApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'api/wise',
    prepareHeaders: (headers, { getState }) => {
      headers.set('Content-Type', 'application/json');
      headers.set('Accept', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Currency', 'Currencies', 'Profile', 'Quote', 'Comparisons', 'Rate'],
  endpoints: (builder) => ({
    getCurrencies: builder.query<WiseCurrency[], void>({
      query: () => '/currencies',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ code }) => ({ type: 'Currencies' as const, code: code })),
              { type: 'Currencies', code: 'LIST' },
            ]
          : [{ type: 'Currencies', code: 'LIST' }],
    }),
    getCurrency: builder.query<WiseCurrency, string>({
      query: (code) => `currencies/${code}`,
      providesTags: (result, error, code) => [{ type: 'Currency', code: code }],
    }),
    getComparisons: builder.query<
      WiseComparison,
      { sourceCurrency: string; targetCurrency: string; sendAmount: number }
    >({
      query: ({ sourceCurrency, targetCurrency, sendAmount }) =>
        `/compare?sourceCurrency=${sourceCurrency}&targetCurrency=${targetCurrency}&sendAmount=${sendAmount}`,
      providesTags: ['Comparisons'],
    }),
    getRate: builder.query<WiseRate, { sourceCurrency: string; targetCurrency: string }>({
      query: ({ sourceCurrency, targetCurrency }) =>
        `/rate?sourceCurrency=${sourceCurrency}&targetCurrency=${targetCurrency}`,
      providesTags: ['Rate'],
    }),
  }),
});

export const {
  useGetCurrenciesQuery,
  useGetCurrencyQuery,
  useGetComparisonsQuery,
  useLazyGetComparisonsQuery,
  useGetRateQuery,
  useLazyGetRateQuery,
} = wiseApi;
