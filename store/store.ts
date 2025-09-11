import { Action, combineReducers, configureStore, ThunkAction } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';

import { coreApi } from './apis/core.api';
import { wiseApi } from './apis/wise.api';
import storage from './storage';
import appReducer from './slices/app.slice';
import themeReducer from './slices/theme.slice';

const rootReducers = combineReducers({
  // Add API reducers here
  [coreApi.reducerPath]: coreApi.reducer,
  [wiseApi.reducerPath]: wiseApi.reducer,
  // Add other slice-based reducers here
  app: appReducer,
  theme: themeReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['app', 'theme'],
};

const persistedReducer = persistReducer(persistConfig, rootReducers);

export const makeStore = () => {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      })
        .concat(coreApi.middleware)
        .concat(wiseApi.middleware),
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
