'use client';
import React from 'react';

import { toMoney, pctFmt, rateFmt } from 'utils/helper.function';

const TooltipContent: React.FC<any> = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const p = payload[0]?.payload;
  return (
    <div className="rounded-xl border border-gray-200 text-black dark:text-white bg-white p-3 shadow-md dark:bg-gray-900 dark:border-gray-700">
      <div className="font-semibold border-b py-1 border-b-gray-400/30">{p.name}</div>
      <div className="mt-1 text-sm space-y-1">
        <div>
          Received: <b>{toMoney(p.receivedAmount, p.targetCurrency)}</b>
        </div>
        <div>
          Fee: <b>{toMoney(p.fee, p.sourceCurrency)}</b>
        </div>
        <div>
          Advertised rate: <b>{rateFmt(p.rate)}</b>
        </div>
        <div>
          Effective rate<span className="text-yellow-500 text-bold">*</span> :{' '}
          <b>{rateFmt(p.effectiveRate)}</b>
        </div>
        <div>
          Markup: <b>{pctFmt(p.markup)}</b>
        </div>
        <div>
          Mid-market: <b>{p.midMarket ? 'Yes' : 'No'}</b>
        </div>
        <div className="mt-1 text-xs opacity-60">
          *effectiveRate = receivedAmount / sendAmount ({p.amount?.toLocaleString()}{' '}
          {p.sourceCurrency})
        </div>
      </div>
    </div>
  );
};

export default TooltipContent;
