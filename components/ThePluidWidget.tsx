'use client';

import React from 'react';

import ActionButton from '@components/ux/ActionButton';

const ThePluidWidget = () => {
  return (
    <div className="flex flex-row h-screen w-screen justify-center items-stretch relative">
      <ActionButton />
      <div className="bg-background-light dark:bg-gray-800/50 dark:hover:bg-gray-700/40 cursor-pointer border-2 border-gray-300 hover:bg-gray-200/70 dark:border-gray-500">
        {/* Other widget content can go here */}www
      </div>
    </div>
  );
};

export default ThePluidWidget;
