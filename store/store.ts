import { Action, combineReducers, configureStore, ThunkAction } from '@reduxjs/toolkit';
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import { coreApi } from 'apis/core.api';

import storage from './storage';
import appReducer from './slices/app.slice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['app'],
};

const rootReducers = combineReducers({
  [coreApi.reducerPath]: coreApi.reducer,

  // Add other reducers here
  app: appReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducers);

export const makeStore = () => {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(coreApi.middleware),
  });
  const persistor = persistStore(store);
  // Return Persistor and store objects
  return { store, persistor };
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>['store'];
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
