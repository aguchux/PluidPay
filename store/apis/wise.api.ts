import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const WISE_API_BASE = 'https://api.sandbox.transferwise.tech/v1';

export const wiseApi = createApi({
  reducerPath: 'wiseApi',
  baseQuery: fetchBaseQuery({
    baseUrl: WISE_API_BASE,
    prepareHeaders: (headers, { getState }) => {
      headers.set('Authorization', `Bearer a35b0245-7e27-4843-a603-b3cc4e178808`);
      headers.set('Content-Type', 'application/json');
      headers.set('Accept', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Profile', 'Quote'],
  endpoints: (builder) => ({
    getCurrencies: builder.query<any, void>({
      query: () => '/currencies',
    }),
    getQuotes: builder.query<
      any,
      { sourceCurrency: string; targetCurrency: string; sourceAmount: number }
    >({
      query: ({ sourceCurrency, targetCurrency, sourceAmount }) => ({
        url: '/quotes',
        method: 'POST',
        body: { sourceCurrency, targetCurrency, sourceAmount, profile: 123456 }, // Replace with actual profile ID
      }),
      providesTags: ['Quote'],
    }),
    // Add more endpoints as needed
    getProfile: builder.query<any, void>({
      query: () => '/profiles',
      providesTags: ['Profile'],
    }),
    // Add more endpoints as needed
  }),
});

export const { useGetCurrenciesQuery, useGetQuotesQuery, useGetProfileQuery } = wiseApi;
