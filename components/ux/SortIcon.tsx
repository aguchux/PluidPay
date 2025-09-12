import React from 'react';

const SortIcon = ({ dir }: { dir?: 'asc' | 'desc' }) => {
  return (
    <svg
      aria-hidden={true}
      className={`h-3.5 w-3.5 ml-1 inline-block align-middle ${dir === 'asc' ? 'rotate-180' : ''}`}
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.178l3.71-3.0a.75.75 0 111.04 1.08l-4.24 3.43a.75.75 0 01-.96 0L5.21 8.31a.75.75 0 01.02-1.1z" />
    </svg>
  );
};

export default SortIcon;
