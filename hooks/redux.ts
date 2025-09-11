// Centralized hooks for Redux with TypeScript support
// This file provides typed versions of useDispatch and useSelector hooks
// to ensure type safety across the application when interacting with the Redux store.
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState, AppThunk } from '@store/store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppThunk = () => {
  const dispatch = useAppDispatch();
  return (thunk: AppThunk) => dispatch(thunk);
};
