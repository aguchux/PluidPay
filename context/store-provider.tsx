'use client';

import type React from 'react';
import { useMemo } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { makeStore } from '@store/store';

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  const { store, persistor } = useMemo(() => makeStore(), []);
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}

export { StoreProvider };
