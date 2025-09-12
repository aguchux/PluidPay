import React from 'react';

import { ProviderRow, WiseQuote } from 'types/wise.types';

import Badge from './Badge';

const TopThree = ({
  rows,
  currency,
}: {
  rows: ProviderRow[] & { bestQuote: WiseQuote }[];
  currency: string;
}) => {
  const top = [...rows]
    .sort((a, b) => (b.bestQuote?.receivedAmount ?? 0) - (a.bestQuote?.receivedAmount ?? 0))
    .slice(0, 3);
  if (!top.length) return null;
  return (
    <div className="rounded-xl border border-gray-300 dark:border-gray-700 p-3 text-gray-900 dark:text-white">
      <div className="mb-2 text-xs font-semibold uppercase">Top 3 by Received</div>
      <div className="flex flex-wrap gap-2">
        {top.map((r) => (
          <div
            key={r.providerId}
            className="flex items-center gap-2 rounded-lg px-3 py-2 shadow-sm ring-1 text-gray-900 dark:text-white ring-gray-400 dark:bg-gray-300/30 dark:ring-gray-500 "
          >
            {r.logoSrc ? (
              <img src={r.logoSrc} alt={r.name} className="h-4 w-auto" />
            ) : (
              <div className="h-4 w-4 rounded" />
            )}
            <span className="text-sm font-medium">{r.name}</span>
            <span className="text-xs ">
              · {(r.bestQuote?.receivedAmount ?? 0).toLocaleString()} {currency}
            </span>
            {r.isMidMarket && (
              <Badge className="bg-green-100 text-green-800 border border-green-200">Mid</Badge>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopThree;
