'use client';

import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LabelList,
} from 'recharts';

import { ComparisonResponse } from 'types/wise.types';
import { pickBestQuote } from 'utils/helper.function';
import { useGetCurrencyQuery } from '@store/apis/wise.api';

import TooltipContent from './TooltipContent';

// Price comparison bar chart from Recharts
// (https://recharts.org/)
type PriceComparisonChartProps = {
  data: ComparisonResponse;
  className?: string;
  metric?: 'received' | 'effectiveRate';
};

const PriceComparisonChart: React.FC<PriceComparisonChartProps> = ({
  data,
  className,
  metric = 'received',
}) => {
  const [selectedMetric, setSelectedMetric] = useState<'received' | 'effectiveRate'>(metric);

  // I want to show currency symbol in tooltip, so fetch currency data
  // for target currency
  // (could be optimized by passing in from parent if already fetched)
  // This seemed like an overkill for me but I wanted to show it anyway
  // as I had some spare time
  const { data: currencyData, isLoading: isLoadingCurrency } = useGetCurrencyQuery(
    data.targetCurrency,
    { skip: !data.targetCurrency },
  );

  const rows = useMemo(() => {
    const amount = data.amount;
    const sourceCurrency = data.sourceCurrency;

    const list = data.providers
      .map((prov) => {
        const best = pickBestQuote(prov.quotes);
        if (!best || best.receivedAmount == null) return null;

        const effectiveRate = amount && amount > 0 ? best.receivedAmount / amount : null;

        return {
          id: prov.id,
          alias: prov.alias,
          name: prov.name,
          type: prov.type,
          midMarket: !!best.isConsideredMidMarketRate,
          receivedAmount: best.receivedAmount,
          fee: best.fee ?? 0,
          rate: best.rate ?? null,
          effectiveRate,
          markup: best.markup ?? null,
          dateCollected: best.dateCollected,
          amount,
          sourceCurrency,
        };
      })
      .filter(Boolean) as Array<{
      id: number;
      alias: string;
      name: string;
      type: string;
      midMarket: boolean;
      receivedAmount: number;
      fee: number;
      rate: number | null;
      effectiveRate: number | null;
      markup: number | null;
      dateCollected: string;
      amount: number;
      sourceCurrency: string;
    }>;

    // Sort by chosen metric (desc)
    return list.sort((a, b) => {
      const av = selectedMetric === 'received' ? a.receivedAmount : (a.effectiveRate ?? -Infinity);
      const bv = selectedMetric === 'received' ? b.receivedAmount : (b.effectiveRate ?? -Infinity);
      return bv - av;
    });
  }, [data, selectedMetric]);

  return (
    <div
      className={`w-full rounded-2xl p-4 text-black dark:text-white shadow-sm bg-gray-300/60 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 ${className ?? ''}`}
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold">Price Comparison</h3>
          <p className="text-sm opacity-70">
            Route: {data.sourceCurrency} → {data.targetCurrency} • Send:{' '}
            {data.amount.toLocaleString()} {data.sourceCurrency}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm opacity-70">Metric:</label>
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value as any)}
            className="rounded-lg border border-gray-300 bg-white px-2 py-1 text-sm dark:bg-gray-800 dark:border-gray-600"
          >
            <option value="received"> {} Received (net)</option>
            <option value="effectiveRate">
              Effective Rate ({data.sourceCurrency}/{data.targetCurrency})
            </option>
          </select>
        </div>
      </div>

      <div className="h-[400px] w-full ">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={rows} margin={{ top: 16, right: 24, left: 8, bottom: 48 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis
              dataKey="name"
              angle={-30}
              textAnchor="end"
              color="#ffffff"
              interval={0}
              height={60}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickFormatter={(v: number) =>
                selectedMetric === 'received' ? v.toLocaleString('en-GB') : v.toFixed(3)
              }
              width={selectedMetric === 'received' ? 80 : 60}
            />
            <Tooltip content={<TooltipContent />} />
            <Bar
              activeBar={{ fill: '#1e2939' }}
              dataKey={selectedMetric === 'received' ? 'receivedAmount' : 'effectiveRate'}
              radius={[8, 8, 0, 0]}
            >
              <LabelList
                dataKey={selectedMetric === 'received' ? 'receivedAmount' : 'effectiveRate'}
                position="top"
                formatter={(label: React.ReactNode) => {
                  if (typeof label === 'number') {
                    return selectedMetric === 'received'
                      ? `${isLoadingCurrency ? '~' : currencyData?.symbol} ${label.toLocaleString('en-GB', { maximumFractionDigits: 0 })}`
                      : label.toFixed(3);
                  }
                  return label;
                }}
                style={{ fontSize: 11, opacity: 0.9 }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="text-xs opacity-70">
        Tip: “Effective rate” = received / amount. Some providers show mid-market rate but add fees;
        this chart uses the **net amount received** they report.
      </div>
    </div>
  );
};

export default PriceComparisonChart;
