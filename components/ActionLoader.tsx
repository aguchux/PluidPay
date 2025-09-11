import React from 'react';

const ActionLoader = ({ message }: { message: string }) => {
  return (
    <div className="flex items-center justify-center">
      <div
        className={`w-5 h-5 border-2 border-green-300 border-t-transparent rounded-full animate-spin`}
      />
      <span className="ml-2 text-sm text-gray-500">{message}</span>
    </div>
  );
};

export default ActionLoader;
