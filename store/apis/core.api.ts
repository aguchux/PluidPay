import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import type { RootState } from 'store/store';

export const coreApi = createApi({
  reducerPath: 'coreApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    credentials: 'same-origin',
    prepareHeaders: (headers, { getState }) => {
      // By default, if we have a token in the store,
      // let's use that for authenticated requests
      const token = (getState() as RootState).app.accessToken;
      headers.set('content-type', 'application/json');
      headers.set('accept', 'application/json');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getRoutesInfo: builder.query({
      query: () => '/info',
    }),
  }),
});

export const { useGetRoutesInfoQuery } = coreApi;
