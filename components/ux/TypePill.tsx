import React from 'react';

const TypePill = ({ type }: { type: string }) => {
  const label =
    type === 'moneyTransferProvider' ? 'Transfer Provider' : type === 'bank' ? 'Bank' : type;
  const base = 'inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ring-1';
  const cls =
    type === 'bank'
      ? 'bg-blue-50 text-blue-700 ring-blue-200'
      : type === 'moneyTransferProvider'
        ? 'bg-purple-50 text-purple-700 ring-purple-200'
        : 'bg-gray-50 text-gray-700 ring-gray-200';
  return <span className={`${base} ${cls}`}>{label}</span>;
};

export default TypePill;
