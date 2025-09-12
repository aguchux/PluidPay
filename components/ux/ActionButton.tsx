'use client';

import { SendHorizonalIcon, X } from 'lucide-react';
import React from 'react';

import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { setStartSending } from '@store/slices/app.slice';

const ActionButton = () => {
  const dispatch = useAppDispatch();
  const { startSending } = useAppSelector((state) => state.app);

  const handleClick = () => {
    dispatch(setStartSending(!startSending));
  };

  return (
    <button
      onClick={handleClick}
      className={`rounded-full h-20 w-20 bg-background-light dark:bg-gray-800/50 dark:hover:bg-gray-700/40 cursor-pointer border-2 border-gray-300 hover:bg-gray-200/70 dark:border-gray-500 items-center justify-center flex transition-all ${startSending ? 'animate-pulse fixed bottom-4 right-4' : 'fixed top-4 left-4'}`}
    >
      {startSending ? (
        <X className="h-8 w-8 text-red-500 m-auto" />
      ) : (
        <SendHorizonalIcon className="h-8 w-8 text-primary m-auto" />
      )}
    </button>
  );
};

export default ActionButton;
